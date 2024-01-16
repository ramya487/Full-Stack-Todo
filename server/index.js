const express = require("express");
const app = express();

const port = 3001;

const cors = require("cors");

app.use(
    cors()
  );

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

app.listen(port, () => {
    console.log("Server listening on port 3001");
  });