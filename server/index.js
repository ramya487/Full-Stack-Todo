const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const port = 3001;

const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json()); // to parse requests of content-type application/json

const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "todo",
});

app.get("/fetch/:signupid", (req, res) => {
  const signupid = req.params.signupid;
  const sql1 = "SELECT * FROM tasks where signupid = ?";
  db.query(sql1, [signupid], (err1, result1) => {
    if (err1) {
      console.log(err1);
      return;
    } else {
      console.log(result1);
      res.send(result1);
    }
  });
});

app.put("/check/:id", (req, res) => {
  const id = req.params.id;
  const sql2 = "SELECT isDone FROM tasks WHERE id = ?";
  db.query(sql2, [id], (err2, result2) => {
    if (err2) {
      console.log(err2);
      return;
    } else {
      const check = result2[0].isDone;
      let setValue;
      if (check == 1) {
        setValue = 0;
      } else {
        setValue = 1;
      }
      const sql3 = "UPDATE tasks SET isDone = ? where id = ?";
      db.query(sql3, [setValue, id], (err3, result3) => {
        if (err3) {
          console.log(err3);
          return;
        } else {
          res.json({ Status: "Update Success" });
        }
      });
    }
  });
});

app.delete("/delete/:id", (req, res) => {
  const sql4 = "DELETE FROM tasks WHERE id = ?";
  db.query(sql4, [req.params.id], (err4, result4) => {
    if (err4) {
      console.log(err4);
      return;
    } else {
      res.json({ Status: "Delete Success" });
    }
  });
});

app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const edit = req.body.edit;
  const sql5 = "UPDATE tasks SET todo = ? WHERE id = ?";
  db.query(sql5, [edit, id], (err5, result5) => {
    if (err5) {
      console.log(err5);
      return;
    } else {
      res.json({ Status: "Upate Success" });
    }
  });
});

app.post("/add/:signupid", (req, res) => {
  const todo = req.body.todo;
  const signupid = req.params.signupid;
  const sql6 = "INSERT INTO tasks (todo, isDone, signupid) VALUES (?, ?, ?)";
  db.query(sql6, [todo, 0, signupid], (err6, result6) => {
    if (err6) {
      console.log(err6);
      return;
    } else {
      const sql7 = "SELECT * FROM tasks where signupid = ?";
      db.query(sql7, [signupid], (err7, result6) => {
        if (err6) {
          console.log(err6);
          return;
        } else {
          res.send(result6);
        }
      });
    }
  });
});

app.post("/signup", (req, res) => {
  const email = req.body.signupEmail;
  const myPlainTextPassword = req.body.signupPassword;

  const sql8 = "SELECT * FROM signup WHERE email = ?";

  db.query(sql8, [email], (err8, result8) => {
    if (err8) {
      console.log(err8);
      return;
    } else {
      console.log(result8);
      if (result8.length > 0) {
        res.json({ Status: "Email Exists" });
      } else {
        bcrypt.hash(myPlainTextPassword, saltRounds, function (err, hash) {
          if (err) {
            console.log(err);
            return;
          } else {
            const sql9 = "INSERT INTO signup (email, password) VALUES (?, ?)";

            db.query(sql9, [email, hash], (err9, result9) => {
              if (err9) {
                console.log(err9);
                return;
              } else {
                res.json({ Status: "Data Inserted" });
              }
            });
          }
        });
      }
    }
  });
});

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

app.post("/login", (req, res) => {
  const email = req.body.email;
  const myPlaintextPassword = req.body.password;

  const sql10 = "SELECT * FROM signup WHERE email = ?";

  db.query(sql10, [email], (err, data) => {
    if (err) {
      console.log(err);
      return;
    } else {
      if (data.length > 0) {
        bcrypt.compare(
          myPlaintextPassword,
          data[0].password,
          function (errr, result) {
            if (errr) {
              console.log(errr);
              return;
            } else {
              if (result) {
                const signupid = data[0].signupid;
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
    }
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

app.listen(port, () => {
  console.log("Server listening on port 3001");
});
