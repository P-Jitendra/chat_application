-module(client_control).

-behaviour(gen_server).

-export([start_link/0, start_link/1, handle_call/3, handle_cast/2, handle_info/2, init/1,
         start/3, send_message/3]).
-export([get_client_pid/1, disconnect/1, get_websocket_pid/1, update_websocket_pid/2,
         send_msg_updates_to_client/1]).

-record(state, {id, name, clients_websocket_pid_list = []}).

start_link() ->
    gen_server:start_link({global, ?MODULE}, ?MODULE, [], []).

start_link([{Id, Name}]) ->
    gen_server:start_link({global, {?MODULE, Id}}, ?MODULE, [{Id, Name}], []);
start_link(Opts) ->
    io:format("Unhandled Opts : ~p~n", [Opts]),
    gen_server:start_link({global, ?MODULE}, ?MODULE, Opts, []).

% add_client() ->
% 	gen_server:handle_call({global, ?MODULE}, ?MODULE,)
start(Id, Name, WebsocketPid) when is_integer(Id) andalso Id > 0 andalso is_list(Name) ->
    %{ok, Pid} = gen_server:start_link({global, {?MODULE, Id}}, ?MODULE, [{Id, Name}], []),
    %io:format("#client_control Pid: ~p for UserId: ~p~n", [Pid, Id]),
    % client:start_link(#{id => Id, name => Name}, Pid);
    gen_server:call({global, ?MODULE}, {update_client_websocket_pid_list, Id, WebsocketPid}),
    client_sup:start_child(#{id => Id,
                             name => Name,
                             websocket_pid => WebsocketPid});
start(Id, Name, WebsocketPid) when is_integer(Id) ->
    io:format("Given Id : ~p, Name : ~p, WebsocketPid : ~p~n", [Id, Name, WebsocketPid]),
    {error, id_is_negative};
start(Id, Name, WebsocketPid) ->
    io:format("Given Id : ~p, Name : ~p, WebsocketPid: ~p~n", [Id, Name, WebsocketPid]),
    {error, invalid_arguments}.

get_client_pid(ClientId) ->
    client:get_pid(ClientId).

get_websocket_pid(ClientId) ->
    gen_server:call({global, ?MODULE}, {get_websocket_pid, ClientId}).

update_websocket_pid(ClientId, WebsocketPid) ->
    gen_server:call({global, ?MODULE},
                    {update_client_websocket_pid_list, ClientId, WebsocketPid}).

disconnect(ClientId) ->
    client:disconnect_client(ClientId).

send_message(SourceClientId, TargetClientId, Msg) ->
    %io:format("Entered into handle_info function, Id : ~p~n", [Id]),
    client:send_message(SourceClientId, TargetClientId, Msg).

send_msg_updates_to_client(ClientId) ->
    client:send_msg_updates_to_client(ClientId).

init([]) ->
    {ok, #state{id = undefined, name = undefined}};
init([{Id, Name}]) ->
    % Res = chat_clients_sup:start_child(Count+1),
    {ok, #state{id = Id, name = Name}}.

handle_call({update_client_websocket_pid_list, ClientId, WebsocketPid},
            _From,
            #state{clients_websocket_pid_list = List} = State) ->
    NewList = [{ClientId, WebsocketPid} | List],
    {reply, ok, State#state{clients_websocket_pid_list = NewList}};
handle_call({get_websocket_pid, ClientId},
            _From,
            #state{clients_websocket_pid_list = List} = State) ->
    WebsocketPid = proplists:get_value(ClientId, List),
    io:format("Fetching websocket Pid : ~p for clientId : ~p~n", [WebsocketPid, ClientId]),
    {reply, WebsocketPid, State};
handle_call(_Request, _From, State) ->
    {reply, ignored, State}.

handle_cast(_Msg, State) ->
    {noreply, State}.

handle_info({send_message, TargetClientId, Msg}, #state{id = Id} = State) ->
    io:format("Entered into handle_info function, Id : ~p~n", [Id]),
    client:send_message(Id, TargetClientId, Msg),
    {noreply, State};
handle_info(_Info, State) ->
    {noreply, State}.
