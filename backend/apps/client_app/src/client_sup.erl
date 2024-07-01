-module(client_sup).

-behaviour(supervisor).

-export([start_link/0, stop/0, stop/1, start_child/1, start_child/2, stop_child/1,
         active_children/0]).
-export([init/1]).

start_link() ->
    supervisor:start_link({global, ?MODULE}, ?MODULE, []).

stop() ->
    stop(global:whereis_name(?MODULE)).

stop(Pid) ->
    erlang:exit(Pid, normal).

start_child(Args) when is_map(Args) ->
    supervisor:start_child({global, ?MODULE}, [Args]).

start_child(Id, Name) ->
    supervisor:start_child({global, ?MODULE}, [#{id => Id, name => Name}]).

stop_child(Id) ->
    case global:whereis_name({client, Id}) of
        undefined ->
            {error, client_not_started};
        Pid ->
            supervisor:terminate_child({global, ?MODULE}, Pid)
    end.

active_children() ->
    proplists:get_value(active, supervisor:count_children({global, ?MODULE})).

init([]) ->
    Client =
        #{id => client,
          start => {client, start_link, []},
          type => worker,
          restart => transient},
    %% transient restart startegy means child will be restarted only if it terminates abnormally
    %% i.e. with exit reason other than normal, shutdown or {shutdown, Term}
    Children = [Client],
    %% Assuming the values MaxR for intensity and MaxT for period, then,
    %% if more than MaxR restarts occur within MaxT seconds,
    %% the supervisor terminates all child processes and then itself.
    RestartStrategy = {simple_one_for_one, 10, 20},
    {ok, {RestartStrategy, Children}}.
