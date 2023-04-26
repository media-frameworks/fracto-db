const express = require("express");
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = 3001
const con = mysql.createConnection({
   host: "localhost",
   user: "mikehall",
   password: "Mkch011$",
   database: 'fracto'
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(cors({
   origin: 'http://localhost:3000'
}));

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));

app.get("/level_tiles", (req, res) => {
   con.connect(function (err) {
      con.query(`SELECT * FROM tiles where level=${req.query.level}`, function (err, result, fields) {
         res.send(result);
      });
   });
});

app.get("/free_bailiwicks", (req, res) => {
   con.connect(function (err) {
      const q = "SELECT * FROM free_bailiwicks"
      console.log(q)
      con.query(q, function (err, result, fields) {
         res.send(result);
      });
   });
});

app.get("/burrows", (req, res) => {
   con.connect(function (err) {
      const q = "SELECT * FROM burrows"
      console.log(q)
      con.query(q, function (err, result, fields) {
         res.send(result);
      });
   });
});

app.get("/node_points", (req, res) => {
   con.connect(function (err) {
      const q = "SELECT * FROM node_points"
      console.log(q)
      con.query(q, function (err, result, fields) {
         res.send(result);
      });
   });
});

app.post("/new_tile", (req, res) => {
   const columns = Object.keys(req.query)
   const values = columns.map(column => req.query[column])
   const q = `insert into tiles(${columns.join(',')}) values(?)`;
   console.log(q, values);
   con.query(q, [values], (err, data) => {
      console.log(err, data);
      if (err) return res.json({error: err.sqlMessage});
      else return res.json({data});
   });
});

app.post("/new_free_bailiwick", (req, res) => {
   const columns = Object.keys(req.query)
   const values = columns.map(column => req.query[column])
   const q = `insert into free_bailiwicks(${columns.join(',')}) values(?)`;
   console.log(q, values);
   con.query(q, [values], (err, data) => {
      console.log(err, data);
      if (err) return res.json({error: err.sqlMessage});
      else return res.json({data});
   });
});

app.post("/new_burrow", (req, res) => {
   const columns = Object.keys(req.query)
   const values = columns.map(column => req.query[column])
   const q = `insert into burrows(${columns.join(',')}) values(?)`;
   console.log(q, values);
   con.query(q, [values], (err, data) => {
      console.log(err, data);
      if (err) return res.json({error: err.sqlMessage});
      else return res.json({data});
   });
});

app.post("/new_node_point", (req, res) => {
   const columns = Object.keys(req.query)
   const values = columns.map(column => req.query[column])
   const q = `insert into node_points(${columns.join(',')}) values(?)`;
   console.log(q, values);
   con.query(q, [values], (err, data) => {
      console.log(err, data);
      if (err) return res.json({error: err.sqlMessage});
      else return res.json({data});
   });
});

app.get("/update_status", (req, res) => {
   // console.log("req.body", req.body);
   const new_status = req.query["new_status"]
   const short_codes = req.query["short_codes"]
   const q = `update tiles set status='${new_status}' where short_code in (${short_codes})`;
   console.log(q);
   con.query(q, (err, data) => {
      console.log(err, data);
      if (err) return res.json({error: err.sqlMessage});
      else return res.json({data});
   });
});


