-module(ws_handler).

-behaviour(cowboy_websocket).

-export([init/2, websocket_init/1, websocket_handle/2, websocket_info/2, terminate/3]).

% -record(state, {client_name = undefined, sent_msgs = [], received_msgs = []}).

init(Req, State) ->
    io:format("~nwebsocket connection initiated~n, Req : ~p~n, State: ~p~n", [Req, State]),
    {cowboy_websocket, Req, State, #{idle_timeout => 3600000}}.

websocket_init(State) ->
    {ok, State}.

websocket_handle({text, Data}, State) ->
    DecodedData = jsx:decode(Data),
    io:format("Websocket data received from client, Data : ~p~n", [DecodedData]),
    DataType = maps:get(<<"type">>, DecodedData, undefined),
    case DataType of
        <<"close">> ->
            io:format("#close_event: Printing websocket self Pid : ~p~n", [self()]),
            ClientId = maps:get(<<"clientId">>, DecodedData),
            ConvertedClientId =
                if
                    is_binary(ClientId) ->
                        binary_to_integer(ClientId);
                    true ->
                        ClientId
                end,
            client_control:disconnect(ConvertedClientId),
            % {[{close, 100, <<"normal">>}], State};
            {stop, State};
        <<"connect">> ->
            io:format("Printing websocket self Pid : ~p~n", [self()]),
            ClientInfo = maps:get(<<"connectionInfo">>, DecodedData),
            io:format("#ClientConnection: Received ClientInfo : ~p~n", [ClientInfo]),
            NewClientId = maps:get(<<"clientId">>, ClientInfo),
            NewClientName = maps:get(<<"clientName">>, ClientInfo),
            ConvertedClientId =
                if
                    is_binary(NewClientId) ->
                        binary_to_integer(NewClientId);
                    true ->
                        NewClientId
                end,
            case client_control:get_client_pid(ConvertedClientId) of
                undefined ->
                    client_control:start(ConvertedClientId, binary_to_list(NewClientName), self());
                _ ->
                    client_control:update_websocket_pid(ConvertedClientId, self()),
                    client_control:send_msg_updates_to_client(ConvertedClientId),
                    ok
            end,
            {ok, State};
        <<"send_msg">> ->
            io:format("#send_msg: Printing websocket self Pid : ~p~n", [self()]),
            MsgInfo = maps:get(<<"msg_data">>, DecodedData),
            io:format("#send_msg: Received sendMsg : ~p~n", [MsgInfo]),
            SenderId = maps:get(<<"sender">>, MsgInfo),
            ReceiverId = maps:get(<<"receiver">>, MsgInfo),
            Msg = maps:get(<<"msgInfo">>, MsgInfo),
            ConvertedSenderId =
                if
                    is_binary(SenderId) ->
                        binary_to_integer(SenderId);
                    true ->
                        SenderId
                end,
            ConvertedReceiverId =
                if
                    is_binary(ReceiverId) ->
                        binary_to_integer(ReceiverId);
                    true ->
                        ReceiverId
                end,
            case client_control:get_client_pid(ConvertedSenderId) of
                undefined ->
                    io:format("SenderId:~p Pid is not active~n", [SenderId]),
                    ok;
                _ ->
                    client_control:send_message(ConvertedSenderId, ConvertedReceiverId, Msg)
            end,
            {ok, State};
        _ ->
            {ok, State}
    end;
websocket_handle(Data, State) ->
    io:format("~nWebsocket data from client: ~p~n, State : ~p~n", [Data, State]),
    {ok, State}.

%%websocket_info( { update_messages } , State ) ->
%%  io : format( "~nUpdate messages called in ws handler~n" ) ,
%% { reply , { text , "dawfsda"} , State } ;
websocket_info({chat_data_updates, Msg}, State) ->
    %% [#{<<"userId">> => 123, <<"msg">> => <<"Hi John">>, <<"timestamp">> => calendar:local_time()}]
    SentMsgs = maps:get(sent_msgs, Msg, []),
    ReceivedMsgs = maps:get(received_msgs, Msg, []),
    EncodedSentMsgs = client_utils:encode_msgs_list(SentMsgs),
    EncodedReceivedMsgs = client_utils:encode_msgs_list(ReceivedMsgs),
    Reply =
        jsx:encode(#{<<"type">> => <<"update_msgs">>,
                     <<"msg_list">> =>
                         #{<<"sent_msgs">> => EncodedSentMsgs,
                           <<"received_msgs">> => EncodedReceivedMsgs}}),
    io:format("Sending updates to Client, Reply : ~p~n", [Reply]),
    {reply, {text, Reply}, State};
websocket_info(Info, State) ->
    io:format("~nInfo received from Client : ~p~n, State : ~p~n", [Info, State]),
    {ok, State}.

terminate(Reason, Req, State) ->
    io:format("~nWebsocekt connection terminated, Reason : ~p, Req : ~p~n, State : ~p~n",
              [Reason, Req, State]),
    ok.
