-module(client).

-behvaiour(gen_statem).

-include_lib("kernel/include/logger.hrl").

-export([start_link/1, stop/1, send_message/3, get_pid/1]).
-export([callback_mode/0, init/1, disconnected/3, connected/3, terminate/3]).
-export([disconnect_client/1, send_msg_updates_to_client/1]).

-define(SERVER, ?MODULE).
-define(CONNECTION_RETRY_TIME, 2000).
-define(REGISTER_DELAY, 1000).
-define(FIRST_STATUS_DELAY, 150).

-record(state, {id, name, rcs_ip, rcs_port, socket, sent_msgs = [], received_msgs = []}).

start_link(#{id := Id} = Args) ->
    gen_statem:start_link({global, {?SERVER, Id}}, ?MODULE, Args, []).

stop(Id) ->
    case global:whereis_name({?SERVER, Id}) of
        undefined ->
            io:format("Pid is undefined for ClientId : ~p~n", [Id]),
            ok;
        _ ->
            gen_statem:stop({global, {?SERVER, Id}})
    end.

disconnect_client(Id) ->
    io:format("Logout event received from Client UI for ClientId : ~p~n", [Id]),
    stop(Id).

send_message(Id, TargetClientId, Msg) ->
    io:format("Entering into client module send_message function call~n"),
    gen_statem:cast({global, {?SERVER, Id}}, {send_message, TargetClientId, Msg}).

send_msg_updates_to_client(Id) ->
    case global:whereis_name({?SERVER, Id}) of
        undefined ->
            io:format("Cannot trigger msg updates to Client as ClientId is not active~n"),
            ok;
        Pid ->
            Pid ! {send_msg_updates_to_client}
    end.

get_pid(ClientId) ->
    global:whereis_name({?SERVER, ClientId}).

callback_mode() ->
    state_functions.

init(#{id := Id, name := Name}) ->
    RcsIp = application:get_env(client_app, rcs_ip, "127.0.0.1"),
    RcsPort = application:get_env(client_app, rcs_port, 7071),
    io:format("Starting client~n", []),
    NewState =
        #state{id = Id,
               name = Name,
               rcs_ip = RcsIp,
               rcs_port = RcsPort},
    {ok, disconnected, NewState, {next_event, internal, try_connect}}.

disconnected(Type, try_connect, State) ->
    io:format("Started try_connect event for type : ~p~n", [Type]),
    RcsIp = State#state.rcs_ip,
    RcsPort = State#state.rcs_port,
    case gen_tcp:connect(RcsIp,
                         RcsPort,
                         [binary,
                          {active, once},
                          {keepalive, true},
                          {nodelay, true},
                          {packet, 4},
                          {reuseaddr, true}])
    of
        {ok, Socket} ->
            io:format(standard_error,
                      "Server is connected on rcs_port : ~p, rcs_ip : ~p~n, socket : ~p",
                      [RcsPort, RcsIp, Socket]),
            {next_state,
             connected,
             State#state{socket = Socket},
             {next_event, internal, send_init}};
        {error, Reason} ->
            io:format("Server connection failed due to ~p~n", [Reason]),
            {keep_state_and_data, {state_timeout, ?CONNECTION_RETRY_TIME, try_connect}}
    end;
disconnected(Type, Event, _State) ->
    io:format(standard_error,
              "Unhandled disconnected state for event : ~p with type : ~p~n",
              [Event, Type]),
    keep_state_and_data.

connected(internal, send_init, State) ->
    io:format("Sending init message to server~n", []),
    ClientId = State#state.id,
    Socket = State#state.socket,
    Message =
        #{messageType => <<"INIT">>,
          messageInfo => 'InitMessage',
          client_id => ClientId},
    gen_tcp:send(Socket, term_to_binary(Message)),
    % true = client_utils:register_client({chatting_client, ClientId}, []),
    keep_state_and_data;
connected(cast, {send_message, TargetClientId, Msg}, #state{socket = Socket} = State) ->
    io:format("Sending msg to the server~n", []),
    FromId = State#state.id,
    FromName = State#state.name,
    MsgDetails =
        #{target_client_id => TargetClientId,
          messageInfo => Msg,
          senderDetails => {FromId, FromName}},
    gen_tcp:send(Socket, term_to_binary(MsgDetails)),
    keep_state_and_data;
connected(info,
          {send_msg_updates_to_client},
          #state{sent_msgs = SentMsgs, received_msgs = ReceivedMsgs} = State) ->
    WebsocketPid = client_control:get_websocket_pid(State#state.id),
    Msg = #{sent_msgs => SentMsgs, received_msgs => ReceivedMsgs},
    WebsocketPid ! {chat_data_updates, Msg},
    keep_state_and_data;
connected(info, {tcp, Socket, Data}, State) ->
    % io:format("Data : ~p~n", [Data]),
    {NewState, Actions} =
        case catch binary_to_term(Data) of
            {error, Reason} ->
                io:format("Decoding error, Reason : ~p~n", [Reason]),
                {State, []};
            #{messageType := "INIT", messageInfo := 'InitResponse'} ->
                io:format("Received init response, data : ~p~n", [Data]),
                {State,
                 [{{timeout, register}, ?REGISTER_DELAY, send_register},
                  {{timeout, status}, ?FIRST_STATUS_DELAY, send_status}]};
            #{messageType := "DATA",
              messageInfo := Msg,
              senderDetails := SenderDetails} ->
                {State, [{{timeout, received_msg}, 0, {Msg, SenderDetails}}]};
            #{messageType := "MsgUpdates", messageInfo := ClientChatData} ->
                {State, [{{timeout, msg_updates}, 0, {ClientChatData, <<"Chat Server">>}}]};
            DecodedData ->
                io:format("Received data : ~p~n", [DecodedData]),
                {State, []}
        end,
    inet:setopts(Socket, [{active, once}]),
    {keep_state, NewState, Actions};
connected(info, {tcp_closed, _Socket}, State) ->
    io:format("Tcp connection is closed~n", []),
    {next_state,
     disconnected,
     State#state{socket = undefined},
     {state_timeout, ?CONNECTION_RETRY_TIME, try_connect}};
connected(info, {tcp_error, Reason}, State) ->
    io:format("Error in tcp connection due to ~p~n", [Reason]),
    {next_state,
     disconnected,
     State#state{socket = undefined},
     {state_timeout, ?CONNECTION_RETRY_TIME, try_connect}};
connected({timeout, register}, send_register, State) ->
    io:format("Entering into timeout register, ~p", [State]),
    Socket = State#state.socket,
    Message =
        #{messageType => <<"DATA">>,
          messageInfo => 'RegisterMessage',
          client_id => State#state.id},
    %% gen_tcp:send(State#state.socket, term_to_binary(Message)),
    %% Sending twice to model the observed behavior
    gen_tcp:send(Socket, term_to_binary(Message)),
    keep_state_and_data;
connected({timeout, received_msg}, {Msg, SenderDetails}, _State) ->
    io:format("Got msg : ~p from : ~p~n", [Msg, SenderDetails]),
    keep_state_and_data;
connected({timeout, msg_updates}, {Msg, SenderDetails}, #state{id = Id} = State) ->
    io:format("#Id:~p, Updates on Chat Data : ~p from ~p~n", [Id, Msg, SenderDetails]),
    ClientWebsocketPid = client_control:get_websocket_pid(Id),
    % #{sent_msgs => SentMsgs, received_msgs => ReceivedMsgs}
    SentMsgs = maps:get(sent_msgs, Msg),
    ReceivedMsgs = maps:get(received_msgs, Msg),
    SortedSentMsgs = client_utils:sort_msgs_list(SentMsgs),
    SortedReceivedMsgs = client_utils:sort_msgs_list(ReceivedMsgs),
    case ClientWebsocketPid of
        undefined ->
            ok;
        _ ->
            ClientWebsocketPid
            ! {chat_data_updates,
               Msg#{sent_msgs => SortedSentMsgs, received_msgs => SortedReceivedMsgs}}
    end,
    {keep_state, State#state{sent_msgs = SortedSentMsgs, received_msgs = SortedReceivedMsgs}};
connected({timeout, status}, send_status, State) ->
    % io:format("Entering into timeout status : ~p", [State]),
    Socket = State#state.socket,
    Message =
        #{messageType => <<"DATA">>,
          messageInfo => 'StatusInfo',
          client_id => State#state.id},
    gen_tcp:send(Socket, term_to_binary(Message)),
    {keep_state, State, [{{timeout, status}, 5000, send_status}]}.

terminate(Reason, State, Data) ->
    io:format(standard_error,
              "Terminated due to : ~p and Currstate : ~p during termination, State Data : ~p~n",
              [Reason, State, Data]),
    ok.
