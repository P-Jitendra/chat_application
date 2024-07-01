-module(temp_storage).

-behaviour(gen_server).

-export([add_client/2, get_client_list/0]).
-export([start_link/0, init/1, handle_call/3, handle_cast/2, handle_info/2]).

-define(SERVER, ?MODULE).

-record(state, {client_list = #{}}).

start_link() ->
    gen_server:start_link({global, ?MODULE}, ?MODULE, [], []).

add_client(ClientId, Socket) ->
    Pid = global:whereis_name(?SERVER),
    Pid ! {ClientId, Socket}.

get_client_list() ->
    gen_server:call({global, ?MODULE}, get_client_list).

init([]) ->
    process_flag(trap_exit, true),
    {ok, #state{client_list = #{}}}.

handle_call(get_client_list, _From, State = #state{client_list = ClientList}) ->
    {reply, ClientList, State};
handle_call(_Msg, _From, State) ->
    {reply, ok, State}.

handle_cast(_, State) ->
    {noreply, State}.

handle_info({ClientId, Socket}, State = #state{client_list = ClientList}) ->
    NewClientList = ClientList#{ClientId => Socket},
    NewState = State#state{client_list = NewClientList},
    {noreply, NewState};
handle_info(_Info, State) ->
    {noreply, State}.
