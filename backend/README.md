chat_app
=====

An OTP application

Build
-----
$ rebar3 compile

## Command to start server app
rebar3 shell -r server_app --config apps\server_app\config\sys.config --sname chat_server

## Command to start client app
rebar3 shell -r client_app --config apps\client_app\config\sys.config --sname client
