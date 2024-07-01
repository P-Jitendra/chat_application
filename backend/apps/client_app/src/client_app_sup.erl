%%%-------------------------------------------------------------------
%% @doc client_app top level supervisor.
%% @end
%%%-------------------------------------------------------------------

-module(client_app_sup).

-behaviour(supervisor).

-export([start_link/0]).
-export([init/1]).

-define(SERVER, ?MODULE).

start_link() ->
    supervisor:start_link({local, ?SERVER}, ?MODULE, []).

%% sup_flags() = #{strategy => strategy(),         % optional
%%                 intensity => non_neg_integer(), % optional
%%                 period => pos_integer()}        % optional
%% child_spec() = #{id => child_id(),       % mandatory
%%                  start => mfargs(),      % mandatory
%%                  restart => restart(),   % optional
%%                  shutdown => shutdown(), % optional
%%                  type => worker(),       % optional
%%                  modules => modules()}   % optional
init([]) ->
    SupFlags =
        #{strategy => one_for_one,
          intensity => 0,
          period => 1},
    ClientSup =
        #{id => client_sup,
          start => {client_sup, start_link, []},
          type => supervisor},
    ClientControl =
        #{id => client_control,
          start => {client_control, start_link, []},
          type => worker,
          restart => transient},
    ChildSpecs = [ClientSup, ClientControl],
    {ok, {SupFlags, ChildSpecs}}.

%% internal functions
