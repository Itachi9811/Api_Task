const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const moment = require('moment');
// var mysql = require("mysql");

// var hostname = "u1y.h.filess.io";
// var database = "Scoreboard_privatetie";
// var port = "3307";
// var username = "Scoreboard_privatetie";
// var password = "d93fd5af685a5d9b3a565bb61807a000a2998e8a";
// const app = express();
// var con = mysql.createConnection({
//   host: hostname,
//   user: username,
//   password,
//   database,
//   port,
// });

var hostname = "sql6.freesqldatabase.com";
var database = "sql6679479";
var port = "3306";
var username = "sql6679479";
var password = "11m5DZDu9u";
const app = express();
var con = mysql.createConnection({
  host: hostname,
  user: username,
  password,
  database,
  port,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

con.query("SELECT 1+1").on("result", function (row) {
  console.log(row);
});

app.get('/lb/cw', ( req,res) => {
   const startOfWeek = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
   const endOfWeek = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss');
   const query = 'SELECT * FROM leaderboard WHERE TimeStamp BETWEEN ? AND ? ORDER BY Score DESC LIMIT 200';
 
   con.query(query, [startOfWeek, endOfWeek], (err, results) => {
     if(err){
       console.error('Error querying the database:', err);
       res.status(500).send('Internal Server Error');
     } 
     else{
      res.json(results);
     }
   });
 });

 app.get('/lb/lw/:country', (req, res) => {
   const country = req.params.country;
   const startOfLastWeek = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD HH:mm:ss');
   const endOfLastWeek = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD HH:mm:ss');
   const query = `SELECT * FROM leaderboard WHERE Country = ? AND TimeStamp BETWEEN ? AND ? ORDER BY Score DESC LIMIT 200`;
   
   con.query(query, [country, startOfLastWeek, endOfLastWeek], (err, results) => {
       if (err){
       console.error('Error querying the database:', err);
       res.status(500).send('Internal Server Error');
       } 
      else if(results.length == 0){
         console.log("Country not found");
         res.status(404).send('Country not found');
      } 
      else {
         res.json(results);
      }
       
   });
   });

   app.get('/ur/:userId', (req, res) => {
      const userId = req.params.userId;
      const query = `SELECT UID, Name, Score, (
        SELECT COUNT(DISTINCT Score) + 1
        FROM leaderboard AS t2
        WHERE t2.Score > t1.Score
      ) AS player_rank
      FROM leaderboard AS t1
      WHERE UID = ?
      ORDER BY Score DESC`;
  
      con.query(query, [userId], (err, results) => {
        if(err){
          console.error('Error querying the database:', err);
          res.status(500).send('Internal Server Error');
        } 
        else if(results.length == 0){
          res.status(404).send('User ID not found');
        } 
        else{
         res.json(results);
        }
      });
    });

  
app.listen(4000,()=>{
    console.log("Server is runnig on Port: 4000")
})
