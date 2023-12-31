import e, { response } from "express";
import pg from "pg";
import * as fs from "fs";
const Pool = pg.Pool;

const pool = new Pool({
  user: "me",
  database: "api",
  host: "localhost",
  password: "password",
  port: 5432,
});

//Get all users function
const getUsers = (request, response) => {
  pool.query("SELECT * FROM client_data ORDER BY mobileno", (error, result) => {
    if (error) {
      console.log(`Printing error for getUsers: ${error}`);
      throw error;
    }
    response.status(200).json(result.rows);
  });
};
//Get all contacts for given userId
const getAllContacts = (request, response) => {
  const mobileno = parseInt(request.params.mobileno);
  pool.query(
    "SELECT * FROM contacts  WHERE mobileno = $1",
    [mobileno],
    (error, result) => {
      if (error) {
        console.log(`Got error while fetching contacts : ${error}`);
      } else {
        //response.status(200).json(result.rows);
        response.status(200).json({
          status: "success",
          user_contacts: result.rows,
        });
      }
    }
  );
};

const getUserById = (request, response) => {
  // console.log(`Id : ${request.params.id}`);
  const mobileno = parseInt(request.params.mobileno);
  // console.log(`MobileNo : ${mobileno}`);
  pool.query(
    "SELECT * FROM client_data WHERE mobileno = $1",
    [mobileno],
    (error, result) => {
      if (error) {
        console.log(`Printing error for getUserById: ${error}`);
        throw error;
      }
      // console.log(result);
      // console.log(response.json(result));
      response.status(200).json(result.rows);
    }
  );
};

// Post opertation to fetch user for login
const fetchUser = (request, response) => {
  const { email, password } = request.body;
  console.log(`Email : ${email}`);
  pool.query(
    "SELECT * FROM client_data WHERE email = $1 AND password = $2",
    [email, password],
    (error, result) => {
      if (error) {
        console.log(`Printing error for createUser : ${error}`);
        // return response.json({
        //   status: "error",
        //   error: "Error in running query",
        // });
        return response.status(400).send({
          status: "error",
          msg: "Error in running db query, Plz try again...",
        });
      }
      const res_list = result.rows;
      //console.log(JSON.stringify(randomVariable));
      //console.log("Printing Query res : \n", JSON.stringify(res_list));
      console.log("Printing Query res : \n", res_list);
      if (res_list.length > 0) {
        return response.status(200).send({
          status: "success",
          msg: "User found successfully",
          user_info: {
            username: res_list[0].username,
            mobileno: res_list[0].mobileno,
          },
        });
        //response.json({ status: "success" });
      } else {
        // return response.json({
        //   status: "error",
        //   error: "Incorrect email or password",
        // });
        return response
          .status(200)
          .send({ status: "error", msg: "Incorrect email or password" });
      }
    }
  );
};

//Post a user(post operation)
const createUser = (request, response) => {
  const { name, email, mobileno, password } = request.body;
  console.log(`Received Request body: ${JSON.stringify(request.body)}`);
  pool.query(
    "INSERT INTO client_data (username, email, mobileno, password) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, email, mobileno, password],
    (error, result) => {
      if (error) {
        console.log(`Printing error for createUser : ${error}`);
      } else {
        let Data = [
          result.rows[0].username,
          result.rows[0].email,
          result.rows[0].mobileno,
        ];
        response.status(201).send({
          status: "success",
          msg: `User added with data: ${Data}`,
        });
      }
    }
  );
};

//Post new Contact info for an existing user
const createContact = (request, response) => {
  const { mobileno, clientname, contactno } = request.body;
  if (!Number.isInteger(mobileno)) {
    mobileno = parseInt(request.body.mobileno);
  }
  pool.query(
    "INSERT INTO contacts (mobileno, clientname, contactno) VALUES ($1, $2, $3) RETURNING *",
    [mobileno, clientname, contactno],
    (error, result) => {
      if (error) {
        console.log(`Got error for createContact query : ${error}`);
      } else {
        let Data = [
          result.rows[0].mobileno,
          result.rows[0].clientname,
          result.rows[0].contactno,
        ];
        response.status(201).send({
          status: "success",
          msg: "Contact added successfully",
        });
      }
    }
  );
};

const deleteUser = (request, response) => {
  const mobileno = parseInt(request.params.mobileno);
  pool.query(
    "DELETE FROM client_data WHERE mobileno = $1",
    [mobileno],
    (error, result) => {
      if (error) {
        console.log(`Printing error for deleteUser : ${error}`);
        throw error;
      }
      response.status(200).send(`User deleted with mobileno : ${mobileno}`);
    }
  );
};

const deleteContact = (request, response) => {
  const { mobileno, contactno } = request.body;
  console.log(
    `Received request to delete contact : ${JSON.stringify(request.body)}`
  );
  pool.query(
    "DELETE FROM contacts WHERE mobileno = $1 AND contactno = $2",
    [mobileno, contactno],
    (error, result) => {
      if (error) {
        console.log(`Got error while deleting contact : ${error}`);
      } else {
        response.status(200).send({
          status: "success",
          msg: "Contact deleted successfully",
        });
      }
    }
  );
};

const updateUser = (request, response) => {
  const mobileno = parseInt(request.params.mobileno);
  const { name, email } = request.body;
  // console.log(`Request Body : ${request.body}`);
  // console.log(`Name : ${name}`);
  // console.log(`email : ${email}`);

  pool.query(
    "UPDATE client_data SET username = $1, email = $2 WHERE mobileno = $3",
    [name, email, mobileno],
    (error, result) => {
      if (error) {
        console.log(`Printing error for updateUser : ${error}`);
        throw error;
      }
      response.status(200).send(`User modified with mobileno : ${mobileno}`);
    }
  );
};

const db = {
  getUsers,
  getUserById,
  fetchUser,
  createUser,
  createContact,
  deleteContact,
  getAllContacts,
  deleteUser,
  updateUser,
};

export default db;
