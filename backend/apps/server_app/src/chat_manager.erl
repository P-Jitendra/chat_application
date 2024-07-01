-module(chat_manager).

-behvaviour(gen_server).

-record(state,
        {client_id :: number(), conn_pid, conn_mref, connected = false, client_data = #{}}).

-export([start_link/1, init/1, handle_call/3, handle_cast/2, handle_info/2]).
-export([client_connected/3, update_client_sent_msgs/2, update_client_received_msgs/2,
         send_message_updates_to_clients/2, get_pid/1]).

start_link(ClientId) ->
    gen_server:start_link({global, {?MODULE, ClientId}}, ?MODULE, ClientId, []).

client_connected(ClientId, ConnPid, Params) ->
    gen_server:cast({global, {?MODULE, ClientId}}, {client_connected, ConnPid, Params}).

update_client_sent_msgs(ClientId, NewMsg) ->
    gen_server:cast({global, {?MODULE, ClientId}}, {update_client_sent_msgs, NewMsg}).

update_client_received_msgs(ClientId, NewMsg) ->
    gen_server:cast({global, {?MODULE, ClientId}}, {update_client_received_msgs, NewMsg}).

send_message_updates_to_clients(SenderId, TargetId) ->
    [send_message_updates_to_clients(Client) || Client <- [SenderId, TargetId]].

send_message_updates_to_clients(ClientId) ->
    gen_server:cast({global, {?MODULE, ClientId}}, {message_updates_to_client, ClientId}).

get_pid(ClientId) ->
    global:whereis_name({chat_manager, ClientId}).

init(ClientId) ->
    erlang:process_flag(trap_exit, true),
    io:format("Chat Manager started for ClientId : ~p~n", [ClientId]),
    State =
        #state{client_id = ClientId,
               client_data =
                   #{contacts => [],
                     sent_msgs => [],
                     received_msgs => []}},
    {ok, State}.

handle_call(_Request, _From, State) ->
    {noreply, State}.

handle_cast({update_client_sent_msgs, NewMsgInfo},
            #state{client_data = ClientData} = State) ->
    #{sent_msgs := OldSentMessages} = ClientData,
    NewSentMessages = OldSentMessages ++ [NewMsgInfo],
    NewState = State#state{client_data = ClientData#{sent_msgs => NewSentMessages}},
    {noreply, NewState};
handle_cast({update_client_received_msgs, NewMsgInfo},
            #state{client_data = ClientData} = State) ->
    #{received_msgs := OldSentMessages} = ClientData,
    NewSentMessages = OldSentMessages ++ [NewMsgInfo],
    NewState = State#state{client_data = ClientData#{received_msgs => NewSentMessages}},
    {noreply, NewState};
handle_cast({message_updates_to_client, ClientId},
            #state{client_data = ClientData} = State) ->
    io:format("[CHAT MANAGER] Sending message updates to client with id:~p~n", [ClientId]),
    #{sent_msgs := SentMsgs, received_msgs := ReceivedMsgs} = ClientData,
    MsgData =
        #{messageType => "MsgUpdates",
          messageInfo => #{sent_msgs => SentMsgs, received_msgs => ReceivedMsgs}},
    chat_protocol:send_raw_data(ClientId, term_to_binary(MsgData)),
    {noreply, State};
handle_cast({client_connected, ConnPid, _Params}, State) ->
    MRef =
        case State#state.conn_pid of
            ConnPid ->
                State#state.conn_mref;
            undefined ->
                erlang:monitor(process, ConnPid);
            OldConnPid ->
                erlang:demonitor(OldConnPid),
                erlang:monitor(process, ConnPid)
        end,
    NewState =
        State#state{conn_pid = ConnPid,
                    conn_mref = MRef,
                    connected = true},
    {noreply, NewState};
handle_cast(_Request, State) ->
    {noreply, State}.

handle_info({'DOWN', _Ref, process, ConnPid, _},
            State = #state{client_id = ClientId, conn_pid = ConnPid}) ->
    io:format("ConnPid of client_id : ~w is down~n", [ClientId]),
    {stop, normal, State};
handle_info({'EXIT', Pid, Reason}, State) ->
    io:format("Received reason : ~p from Pid : ~p~n", [Reason, Pid]),
    {stop, Reason, State};
handle_info(Data, State) ->
    io:format("Unhandled_info : ~p received~n", [Data]),
    {noreply, State}.
