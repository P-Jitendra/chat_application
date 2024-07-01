-module(temp_storage_sup).

-behaviour(supervisor).

-export([start_link/0, stop/0]).
-export([init/1]).

-define(SERVER, ?MODULE).

start_link() ->
    supervisor:start_link({global, ?SERVER}, ?MODULE, []).

stop() ->
    case global:whereis_name(?SERVER) of
        undefined ->
            true;
        Pid ->
            erlang:exit(Pid, normal)
    end.

init([]) ->
    TempStorage =
        {temp_storage, {temp_storage, start_link, []}, permanent, 2000, worker, [temp_storage]},
    Children = [TempStorage],
    RestartStrategy = {one_for_one, 4, 10},
    {ok, {RestartStrategy, Children}}.
