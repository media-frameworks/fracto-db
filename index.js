const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const config = require('./admin/mysql.json')

const app = express();
const PORT = 3001

const con = mysql.createConnection(config);

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use(cors({
   origin: '*'
}));

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));

app.get("/level_tiles", (req, res) => {
   con.connect(function (err) {
      con.query(`SELECT *
                 FROM tiles
                 where level = ${req.query.level}`, function (err, result, fields) {
         res.send(result);
      });
   });
});

app.get("/free_bailiwicks", (req, res) => {
   con.connect(function (err) {
      const q = "SELECT * FROM free_bailiwicks"
      console.log(q)
      con.query(q, function (err, result, fields) {
         if (err) {
            console.log(err)
         } else {
            console.log(`${result.length} results`)
         }
         // con.release();
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
   const q = `insert into tiles(${columns.join(',')})
              values (?)`;
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
   const q = `insert into free_bailiwicks(${columns.join(',')})
              values (?)`;
   console.log(q, values);
   con.query(q, [values], (err, data) => {
      console.log(err, data);
      if (err) return res.json({error: err.sqlMessage});
      else return res.json({data});
   });
});

app.post("/update_free_bailiwick", (req, res) => {
   const columns = Object.keys(req.query)
   const values = columns.map(column => req.query[column])
   const nvpairs = columns.map(column=>{
      return `${column}='${req.query[column]}'`
   })
   const q = `UPDATE free_bailiwicks SET 
    name = '${req.query['name']}',
    CQ_code = '${req.query['CQ_code']}',
    pattern = ${req.query['pattern']},
    magnitude = ${req.query['magnitude']},
    core_point = '${(req.query['core_point'])}',
    octave_point = '${(req.query['octave_point'])}',
    display_settings = '${(req.query['display_settings'])}',
	updated_at = CURRENT_TIMESTAMP
WHERE
    id = ${req.query['id']}`
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
   const q = `insert into burrows(${columns.join(',')})
              values (?)`;
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
   const q = `insert into node_points(${columns.join(',')})
              values (?)`;
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
   const q = `update tiles
              set status='${new_status}'
              where short_code in (${short_codes})`;
   console.log(q);
   con.query(q, (err, data) => {
      console.log(err, data);
      if (err) return res.json({error: err.sqlMessage});
      else return res.json({data});
   });
});

app.post("/delete_node_point", (req, res) => {
   const node_point_id = req.query["node_point_id"]
   const q = "delete from node_points where id=?"
   con.query(q, [node_point_id], (err, data) => {
      console.log(err, data);
      if (err) return res.json({error: err.sqlMessage});
      else return res.json({data});
   });
});

app.post("/new_media_element", (req, res) => {
   const columns = Object.keys(req.query)
   const values = columns.map(column => req.query[column])
   const q = `insert into media_element(${columns.join(',')})
              values (?)`;
   console.log(q, values);
   con.query(q, [values], (err, data) => {
      console.log(err, data);
      return res.json(data);
   });
});

app.post("/update_media_element", (req, res) => {
   const columns = Object.keys(req.query)
   const values = columns.map(column => req.query[column])
   const nvpairs = columns.map(column => {
      return `${column}='${req.query[column]}'`
   })
   const q = `UPDATE media_elements
              SET type    = '${req.query['type']}',
                  part_of = '${req.query['part_of']}',
                  meta    = '${req.query['meta'] || null}'},
                  data    = '${req.query['data'] || null}',
                  updated_at = CURRENT_TIMESTAMP
              WHERE
                  id = ${req.query['id']}`
   console.log(q, values);
   con.query(q, [values], (err, data) => {
      console.log(err, data);
      if (err) return res.json({error: err.sqlMessage});
      else return res.json({data});
   });
});

app.get("/media_element", (req, res) => {
   con.connect(function (err) {
      const q = `SELECT *
                 FROM media_element
                 where id = ${req.query['id']}`
      console.log(q)
      con.query(q, function (err, result, fields) {
         if (err) {
            console.log(err)
            res.send(err)
         } else {
            console.log(result[0])
            res.send(result[0]);
         }
      });
   });
});