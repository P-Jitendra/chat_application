-module(chat_protocol).

-compile(export_all).
-compile(nowarn_export_all).

-behaviour(gen_server).
-behaviour(ranch_protocol).

% -record(state, {
% 	ref,
% 	transport,
% 	socket,
% 	client_ip,
% 	client_id,
% 	monitor_ref
% }).

start_link(Ref, Transport, Opts) ->
    gen_server:start_link(?MODULE, {Ref, Transport, Opts}, []).

send_raw_data(ClientId, Data) ->
    gen_server:call({global, {?MODULE, ClientId}}, {send_raw_data, Data}).

init({Ref, Transport, _Opts}) ->
    % {ok, #{ref = Ref, transport = Transport}, {continue, do_handshake}}.
    io:format("Printing transport value : ~p~n", [Transport]),
    {ok, #{ref => Ref, transport => Transport}, {continue, do_handshake}}.

% handle_continue(do_handshake, #{ref = Ref, transport = Transport} = State) ->
handle_continue(do_handshake, #{ref := Ref, transport := Transport} = State) ->
    {ok, Socket} = ranch:handshake(Ref),
    io:format("Printing Socket value : ~p~n", [Socket]),
    {ok, {ClientIp, _Port}} = inet:peername(Socket),
    ok = Transport:setopts(Socket, [{active, once}, {keepalive, true}, {packet, 4}]),
    % {noreply, State#{socket = Socket, client_ip = ClientIp}}.
    {noreply,
     State#{socket => Socket,
            client_ip => ClientIp,
            client_id => undefined,
            monitor_ref => undefined}}.

% handle_call({send_raw_data, Data}, _From, #{socket = Socket, transport = Transport} = State) ->
handle_call({send_raw_data, Data},
            _From,
            #{socket := Socket, transport := Transport} = State) ->
    Transport:send(Socket, Data),
    {reply, ok, State};
handle_call(_Request, _From, State) ->
    {noreply, State}.

handle_cast(_Request, State) ->
    {noreply, State}.

handle_info({tcp, Socket, Data},
            % State = #{socket = Socket, transport = Transport, client_ip = ClientIp}
            State =
                #{socket := Socket,
                  transport := Transport,
                  client_ip := ClientIp}) ->
    % io:format("Received Data : ~p on tcp, Socket: ~p~n", [Data, Socket]),
    NewState =
        case catch binary_to_term(Data) of
            {error, Reason} ->
                io:format("Error in connecting to the client_ip : ~p, Reason : ~p~n",
                          [ClientIp, Reason]),
                State;
            DecodedData ->
                handle_data(DecodedData, State)
        end,
    Transport:setopts(Socket, [{active, once}]),
    {noreply, NewState};
% handle_info({'DOWN', Ref, process, Pid, Reason}, #{monitor_ref = Ref, client_id = ClientId} = State) ->
handle_info({'DOWN', Ref, process, Pid, Reason},
            #{monitor_ref := Ref, client_id := ClientId} = State) ->
    io:format("Manager is down due to ~p with pid : ~p and reference : ~p~n",
              [Reason, Pid, Ref]),
    NewRef =
        case chat_services_sup:start_child(ClientId) of
            {ok, ClientSup} ->
                erlang:monitor(process, ClientSup);
            {error, {already_started, _ClientSup}} ->
                Ref
        end,
    % NewState = State#{monitor_ref = NewRef},
    NewState = State#{monitor_ref => NewRef},
    {noreply, NewState};
% handle_info({tcp_closed, _Socket}, State = #{client_id = ClientId}) ->
handle_info({tcp_closed, _Socket}, State = #{client_id := ClientId}) ->
    io:format("Connection closed for client_id : ~p~n", [ClientId]),
    Pid = chat_manager:get_pid(ClientId),
    erlang:exit(Pid, shutdown),
    {stop, shutdown, State};
% handle_info({tcp_error, _, Reason}, State = #{client_ip = ClientIP}) ->
handle_info({tcp_error, _, Reason}, State = #{client_ip := ClientIP}) ->
    io:format("Connection error for client_ip : ~p due to : ~p~n", [ClientIP, Reason]),
    {stop, Reason, State};
handle_info(Message, State) ->
    io:format("Message : ~p is unhandled~n", [Message]),
    {noreply, State}.

handle_data(#{client_id := ClientId,
              messageType := <<"INIT">>,
              messageInfo := 'InitMessage'},
            % State = #{socket = Socket, transport = Transport}
            State = #{socket := Socket, transport := Transport}) ->
    io:format("Received init message from client on socket : ~p~n", [Socket]),
    Message = #{messageInfo => 'InitResponse', messageType => "INIT"},
    Transport:send(Socket, term_to_binary(Message)),
    io:format("Init Response sent to the client~n", []),
    % State#{client_id = ClientId};
    temp_storage:add_client(ClientId, Socket),
    State#{client_id => ClientId};
handle_data(#{messageType := <<"DATA">>,
              messageInfo := 'RegisterMessage',
              client_id := ClientId},
            % State = #{socket = Socket, transport = Transport, monitor_ref = CurrentRef, client_id = ClientId}
            State =
                #{socket := Socket,
                  transport := Transport,
                  monitor_ref := CurrentRef,
                  client_id := ClientId}) ->
    io:format("Received register message. ~n", []),
    Message = #{messageType => <<"DATA">>, messageInfo => 'RegisterationResponse'},
    Transport:send(Socket, term_to_binary(Message)),
    io:format("Register Message Response sent to the client~n", []),
    yes = global:re_register_name({chat_protocol, ClientId}, self()),
    NewRef =
        case chat_services_sup:start_child(ClientId) of
            {ok, ClientSup} ->
                erlang:monitor(process, ClientSup);
            {error, {already_started, _}} ->
                CurrentRef
        end,
    % State#{
    % 	monitor_ref = NewRef
    % };
    State#{monitor_ref => NewRef};
handle_data(#{messageType := <<"DATA">>,
              messageInfo := 'StatusInfo',
              client_id := _ClientId},
            % #{socket = _Socket} = State
            #{socket := _Socket} = State) ->
    % io:format("ClientId : ~p is online on socket : ~p~n",[ClientId, Socket]),
    State;
handle_data(#{messageInfo := Msg,
              target_client_id := TargetClientId,
              senderDetails := SenderDetails},
            State = #{socket := Socket, transport := Transport}) ->
    io:format("Received message : ~p on socket : ~p to send to client : ~p~n",
              [Msg, Socket, TargetClientId]),
    %%list_to_binary(io_lib:format("~.4.0w-~.2.0w-~.2.0wT~.2.0w:~.2.0w:~.2.0w.0+00:00", [Year, Month, Day, Hour, Min, Sec])).
    SenderId = element(1, SenderDetails),
    chat_manager:update_client_received_msgs(TargetClientId,
                                             {SenderId, Msg, calendar:local_time()}),
    chat_manager:update_client_sent_msgs(SenderId,
                                         {TargetClientId, Msg, calendar:local_time()}),
    MsgDetails =
        #{messageInfo => Msg,
          messageType => "DATA",
          senderDetails => SenderDetails},
    ClientList = temp_storage:get_client_list(),
    %% TODO : Remove temp_storage module & it's implementation
    %% Use global:whereis_name({?MODULE, TargetClientId}) to fetch Pid and
    %% use gen_server:call method to fetch target_client socket value to send new message
    case maps:get(TargetClientId, ClientList, undefined) of
        undefined ->
            % io:format("~p is disconnected / not registered ~n", [TargetClientId]);
            ServerMsg =
                #{messageType => "DATA",
                  senderDetails => chat_server,
                  messageInfo => "Client is disconnected or not registered"},
            Transport:send(Socket, term_to_binary(ServerMsg));
        TargetSocket ->
            Transport:send(TargetSocket, term_to_binary(MsgDetails)),
            chat_manager:send_message_updates_to_clients(SenderId, TargetClientId)
    end,
    State;
handle_data(Data, #{client_id := ClientId} = State) ->
    io:format("Unhandled data : ~p and State_client_id : ~p~n", [Data, ClientId]),
    State.
