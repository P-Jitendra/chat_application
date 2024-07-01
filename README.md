# Fullstack Chat Application

### `Front end tech stack` : ***ReactJs***, ***NodeJs***

### `Back end tech stack` : ***Erlang***

### `Database` : ***Postgres***

## Steps to setup Postgres

1. Install Postgres 14(pgAdmin14)
2. Create a datbase name as `api`
3. Create 2 tables as `client_data` and `contacts` in table `api`
4. Refer the below screenshots for Postgres table schema

## Attaching the screenshot for Postgres table schema
![Screenshot 2024-07-01 213654](https://github.com/P-Jitendra/chat_application/assets/51356440/7e9bc75b-e4cf-44d3-94dc-3389f60a0bc0)
![Screenshot 2024-07-01 213753](https://github.com/P-Jitendra/chat_application/assets/51356440/3596d8a8-57ac-4b4a-a524-2d4486bc079c)


## Steps to start frontend app

1. **cd frontend/**
2. **npm i**
3. **npm run server**
4. Open frontend folder in different window to start client side(UI) of Frontend
5. **npm start**

## Steps to start backend app

1. **cd backend/**
2. **rebar3 shell -r server_app --config apps\server_app\config\sys.config --sname chat_server**
3. Open backend folder in a different window to start client side of backend
4. **rebar3 shell -r client_app --config apps\client_app\config\sys.config --sname client**

## Attaching the screenshot of Chat App UI pages
![Screenshot 2024-07-01 212135](https://github.com/P-Jitendra/chat_application/assets/51356440/e1135b8f-4554-4a69-9ab5-70a5d1118ff6)
![Screenshot 2024-07-01 212203](https://github.com/P-Jitendra/chat_application/assets/51356440/328abb37-7172-422b-abb9-422bfd35cd42)
![Screenshot 2024-07-01 212423](https://github.com/P-Jitendra/chat_application/assets/51356440/cfe641c5-72ec-41bc-a2f9-4978d1181667)
![Screenshot 2024-07-01 212352](https://github.com/P-Jitendra/chat_application/assets/51356440/35944eef-d41a-46f9-bee1-31372fe58d37)
![Screenshot 2024-07-01 212251](https://github.com/P-Jitendra/chat_application/assets/51356440/053a4c79-fe80-4698-9cce-8bf4eedba1fd)


