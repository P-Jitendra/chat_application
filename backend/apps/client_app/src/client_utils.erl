-module(client_utils).

-export([register_client/2, sort_msgs_list/1, encode_msgs_list/1]).

-spec register_client(ProcessName :: {atom(), number()}, list()) -> any().
register_client(ProcessName, Options) ->
    Self = self(),
    case gproc:lookup_local_name(ProcessName) of
        undefined ->
            try
                gproc:add_local_name(ProcessName)
            catch
                error:badarg ->
                    io:format("gproc register failed for ~p.~n", [ProcessName]),
                    register_client(ProcessName, Options)
            end;
        Self ->
            true;
        Pid ->
            case lists:member(kill_existing, Options) of
                true ->
                    RetryTime = 10, %% in milliseconds
                    io:format("Killing old process forcefully and trying to register new process~n",
                              []),
                    erlang:exit(Pid, kill),
                    timer:sleep(RetryTime),
                    register_client(ProcessName, Options);
                false ->
                    {error, Pid}
            end
    end.

sort_msgs_list(List) ->
    lists:sort(fun({_ClientId1, _Msg1, Msg1Time}, {_ClientId2, _Msg2, Msg2Time}) ->
                  Msg1Time =< Msg2Time
               end,
               List).

encode_msgs_list(List) ->
    lists:map(fun({UserId, Msg, MsgTimestamp}) ->
                ConvertedUserId =
                    if
                        is_integer(UserId) ->
                            erlang:integer_to_binary(UserId);
                        true ->
                            UserId
                    end,
                 #{<<"userId">> => ConvertedUserId,
                   <<"msg">> => Msg,
                   <<"timestamp">> => MsgTimestamp}
              end,
              List).
