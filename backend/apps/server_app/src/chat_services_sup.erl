-module(chat_services_sup).

-behaviour(supervisor).

-export([start_link/0, init/1, start_child/1, stop_child/1]).

start_link() ->
    supervisor:start_link({local, ?MODULE}, ?MODULE, []).

start_child(ClientId) ->
    supervisor:start_child(?MODULE, [ClientId]).

stop_child(ClientId) ->
    case global:whereis_name({chat_server_sup, ClientId}) of
        undefined ->
            io:format("Error in supervisor process~n", []),
            {error, not_started};
        Pid ->
            supervisor:terminate_child({local, ?MODULE}, Pid)
    end.

init([]) ->
    ChatServerSup =
        #{id => chat_server_sup,
          start => {chat_server_sup, start_link, []},
          restart => temporary,
          type => supervisor},
    Children = [ChatServerSup],
    RestartStrategy = {simple_one_for_one, 5, 10},
    {ok, {RestartStrategy, Children}}.
