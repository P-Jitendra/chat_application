# Fullstack Chat Application

Front end tech stack : React js

Back end tech stack : Erlang, Nodejs

Database : Postgres, Mnesia

## Steps to setup Postgres

1. Install Postgres 14(pgAdmin14)
2. Create a table name as `api`
3. Refer the screenshot for Postgres table schema

## Steps to start frontend app

1. cd frontend/
2. npm i ----> To install all the required dependencies of front-end
3. npm run server -----> To start the server side of Frontend
4. Open frontend folder in different window to start client side(UI) of Frontend
5. npm start

## Steps to start backend app

1. cd backend/
2. rebar3 shell -r server_app --config apps\server_app\config\sys.config --sname chat_server
3. Open backend folder in a different window to start client side of backend
4. rebar3 shell -r client_app --config apps\client_app\config\sys.config --sname client

## Attaching the screenshot of Chat App UI pages
