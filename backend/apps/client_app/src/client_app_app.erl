%%%-------------------------------------------------------------------
%% @doc client_app public API
%% @end
%%%-------------------------------------------------------------------

-module(client_app_app).

-behaviour(application).

-export([start/2, stop/1]).

start(_StartType, _StartArgs) ->
    Dispatch =
        cowboy_router:compile([{'_',
                                % {"/", cowboy_static, {priv_file, ws, "index.html"}},
                                [{"/ws", ws_handler, []}]}]),
    {ok, Res} =
        cowboy:start_clear(client_socket,
                           [{port, 8181}],
                           #{env => #{dispatch => Dispatch}, idle_timeout => 3600000}),
    io:format("Printing Websocket start Res : ~p~n", [Res]),
    client_app_sup:start_link().

stop(_State) ->
    ok.

%% internal functions
