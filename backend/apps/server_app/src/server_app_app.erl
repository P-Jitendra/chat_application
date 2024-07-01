%%%-------------------------------------------------------------------
%% @doc server_app public API
%% @end
%%%-------------------------------------------------------------------

-module(server_app_app).

-behaviour(application).

-export([start/2, stop/1]).

start(_StartType, _StartArgs) ->
    ok = chat_listener:start(),
    server_app_sup:start_link().

stop(_State) ->
    ok.

%% internal functions
