-module(chat_server_sup).

-behvaiour(supervisor).

-export([start_link/1, init/1]).

start_link(ClientId) ->
    supervisor:start_link({via, global, {?MODULE, ClientId}}, ?MODULE, [ClientId]).

init([ClientId]) ->
    ChatManager =
        #{id => chat_manager,
          start => {chat_manager, start_link, [ClientId]},
          restart => transient,
          significant => true,
          type => worker},
    Children = [ChatManager],
    SupFlags =
        #{strategy => one_for_one,
          intensity => 5,
          period => 10,
          auto_shutdown => any_significant},
    {ok, {SupFlags, Children}}.
