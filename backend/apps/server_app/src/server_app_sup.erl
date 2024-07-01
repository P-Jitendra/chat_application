%%%-------------------------------------------------------------------
%% @doc server_app top level supervisor.
%% @end
%%%-------------------------------------------------------------------

-module(server_app_sup).

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
    ChatServicesSup =
        #{id => chat_services_sup,
          start => {chat_services_sup, start_link, []},
          type => supervisor},
    TempStorageSup =
        #{id => temp_storage_sup,
          start => {temp_storage_sup, start_link, []},
          type => supervisor},
    SupFlags =
        #{strategy => one_for_all,
          intensity => 0,
          period => 1},
    ChildSpecs = [ChatServicesSup, TempStorageSup],
    {ok, {SupFlags, ChildSpecs}}.

%% internal functions
