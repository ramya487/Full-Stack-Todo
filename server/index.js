const express = require("express");
const app = express();

const port = 3001;

const cors = require("cors");

app.use(
    cors()
  );

app.use(express.json()); // to parse requests of content-type application/json

const mysql = require("mysql2");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "todo",
  });

app.get("/", (req, res) => {
    const sql1 = "SELECT * FROM tasks";
    db.query(sql1, (err1, result1) => {
        if (err1){
            console.log(err1);
            return;
        } else {
            console.log(result1);
            res.send(result1);
        }
    })
})

app.put("/check/:id",(req, res) => {
    const id = req.params.id;
    const sql2 = "SELECT isDone FROM tasks WHERE id = ?";
    db.query(sql2, [id], (err2, result2) => {
        if (err2){
            console.log(err2);
            return;
        } else {
            const check = result2[0].isDone;
            let setValue;
            if (check == 1){
                setValue = 0;
            } else {
                setValue = 1;
            }
            const sql3 = "UPDATE tasks SET isDone = ? where id = ?";
            db.query(sql3, [setValue, id], (err3, result3) => {
                if (err3){
                    console.log(err3);
                    return;
                } else {
                    res.json({Status: "Update Success"});
                }
            })
        }
    })
})

app.delete("/delete/:id", (req, res) => {
    const sql4 = "DELETE FROM tasks WHERE id = ?";
    db.query(sql4, [req.params.id], (err4, result4) => {
        if (err4){
            console.log(err4);
            return;
        } else {
            res.json({Status: "Delete Success"});
        }
    })
})

app.post("/edit/:id", (req, res) => {
    const id = req.params.id;
    const edit = req.body.edit;
    const sql5 = "UPDATE tasks SET todo = ? WHERE id = ?";
    db.query(sql5, [edit, id], (err5, result5) => {
        if (err5) {
            console.log(err5);
            return;
        } else {
            res.json({Status: "Upate Success"});
        }
    })
})

app.post("/add",(req, res) => {
    const todo = req.body.todo;
    const sql6 = "INSERT INTO tasks (todo, isDone) VALUES (?, ?)";
    db.query (sql6, [todo, 0], (err6, result6) => {
        if (err6) {
            console.log(err6);
            return;
        } else {
            const sql7 = "SELECT * FROM tasks";
            db.query(sql7, (err7, result6) => {
                if (err6) {
                    console.log(err6);
                    return;
                } else {
                    res.send(result6);
                }
            })
        }
    })
})

app.listen(port, () => {
    console.log("Server listening on port 3001");
  });