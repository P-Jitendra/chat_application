import express from "express";
import bodyParser from "body-parser";
import db from "./queries.mjs";
import cors from "cors";
const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express and Postgres API" });
});

app.get("/users", db.getUsers);

app.get("/getUser/:mobileno", db.getUserById);

app.post("/fetchUser", db.fetchUser);

app.post("/createUser", db.createUser);

app.delete("/deleteUser/:mobileno", db.deleteUser);

app.put("/updateUser/:mobileno", db.updateUser);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
