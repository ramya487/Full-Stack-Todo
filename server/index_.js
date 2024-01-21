// This is for implementing server side with orm (prisma)
const express = require("express");
const app = express();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const port = 3001;

const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Status: "Not authenticated", signupid: -1, email: "" });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return;
      } else {
        req.signupid = decoded.signupid;
        req.email = decoded.email;
        next();
      }
    });
  }
};

app.get("/", verifyUser, (req, res) => {
  return res.json({
    Status: "Authenticated",
    signupid: req.signupid,
    email: req.email,
  });
});

app.post("/signup", async (req, res) => {
  const email = req.body.signupEmail;
  const myPlainTextPassword = req.body.signupPassword;

  const allEmails = await prisma.signup.findMany({
    where: {
      email: email,
    },
  });

  if (allEmails.length > 0) {
    res.json({ Status: "Email Exists" });
  } else {
    bcrypt.hash(myPlainTextPassword, saltRounds, async (err, hash) => {
      if (err) {
        console.log(err);
      } else {
        const newUser = await prisma.signup.create({
          data: {
            email: email,
            password: hash,
          },
        });
      }
    });
    res.json({ Status: "Data Inserted" });
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const myPlaintextPassword = req.body.password;

  const getEmail = await prisma.signup.findMany({
    where: {
      email: email,
    },
  });

//   console.log(getEmail);

  if (getEmail.length > 0) {
    bcrypt.compare(
      myPlaintextPassword,
      getEmail[0].password,
      function (errr, result) {
        if (errr) {
          console.log(errr);
          return;
        } else {
          if (result) {
            const signupid = getEmail[0].id;
            const token = jwt.sign(
              {
                signupid: signupid,
                email: email,
              },
              process.env.JWT_SECRET
            );
            res.cookie("token", token);
            res.json({
              Status: "Login Success",
              email: email,
              signupid: signupid,
            });
          } else
            res.json({
              Status: "Incorrect Password",
              email: "",
              signupid: -1,
            });
        }
      }
    );
  } else {
    res.json({ Status: "Email doesn't exists", email: "", signupid: -1 });
    return;
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

app.get("/fetch/:signupid", async (req, res) => {
  const signupid = req.params.signupid;
  const allTasks = await prisma.tasks.findMany({
    where: {
      signupid: signupid,
    },
  });
  console.log(allTasks);
  res.json(allTasks);
});

app.post("/add/:signupid", async (req, res) => {
  const todo = req.body.todo;
  const signupid = req.params.signupid;
  const newTask = await prisma.tasks.create({
    data: {
      todo: todo,
      isDone: 0,
      signupid: signupid,
    },
  });
  res.send(newTask);
});

app.put("/check/:id", async (req, res) => {
  const id = req.params.id;
  const resultTask = await prisma.tasks.findMany({
    where: {
      id: id,
    },
  });
  if (resultTask) {
    const check = resultTask[0].isDone;
    let setValue;
    if (check == 1) {
      setValue = 0;
    } else {
      setValue = 1;
    }
    const checkedTask = await prisma.tasks.update({
      where: { id: id },
      data: { isDone: setValue },
    });
    if (checkedTask) {
      res.json({ Status: "Update Success" });
    }
  }
});

app.delete("/delete/:id", async (req, res) => {
  const deletedTask = await prisma.tasks.delete({
    where: { id: req.params.id },
  });
  if (deletedTask) {
    res.json({ Status: "Delete Success" });
  }
});

// add edit path here /edit/:id
// app.post("/edit/:id", (req, res) => {
//   const id = req.params.id;
//   const edit = req.body.edit;
//   const sql5 = "UPDATE tasks SET todo = ? WHERE id = ?";
//   db.query(sql5, [edit, id], (err5, result5) => {
//     if (err5) {
//       console.log(err5);
//       return;
//     } else {
//       res.json({ Status: "Upate Success" });
//     }
//   });
// });

app.put("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const edit = req.body.edit;
  const updatedTask = await prisma.tasks.update({
    where: { id: id },
    data: { todo: edit },
  });
  if (updatedTask){
    res.json({ Status: "Upate Success" });
  }
})

app.listen(port, () => {
  console.log("Server running on port " + port);
});
