-module(chat_listener).

-export([start/0, stop/0]).

start() ->
    Port = application:get_env(server_app, tcp_listen_port, 7071),
    {ok, _} =
        ranch:start_listener(chat_tcp,
                             ranch_tcp,
                             #{socket_opts => [{port, Port}]},
                             chat_protocol,
                             []),
    ListenPort = ranch:get_port(chat_tcp),
    io:format("Started listening to port : ~w~n", [ListenPort]),
    ok.

stop() ->
    ranch:stop_listener(chat_tcp).
