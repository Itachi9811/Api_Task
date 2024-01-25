const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const moment = require('moment');

const hostname = "sql6.freesqldatabase.com";
const database = "sql6679479";
const port = "3306";
const username = "sql6679479";
const password = "11m5DZDu9u";

const app = express();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: hostname,
  user: username,
  password,
  database,
  port,
});

app.get('/lb/cw', (req, res) => {
  const startOfWeek = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
  const endOfWeek = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss');
  const query = 'SELECT * FROM leaderboard WHERE TimeStamp BETWEEN ? AND ? ORDER BY Score DESC LIMIT 200';

  pool.getConnection((err, con) => {
    if (err) {
      console.error('Error acquiring a connection:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    con.query(query, [startOfWeek, endOfWeek], (err, results) => {
      con.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      res.json(results);
    });
  });
});

app.get('/lb/lw/:country', (req, res) => {
  const country = req.params.country;
  const startOfLastWeek = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD HH:mm:ss');
  const endOfLastWeek = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD HH:mm:ss');
  const query = `SELECT * FROM leaderboard WHERE Country = ? AND TimeStamp BETWEEN ? AND ? ORDER BY Score DESC LIMIT 200`;

  pool.getConnection((err, con) => {
    if (err) {
      console.error('Error acquiring a connection:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    con.query(query, [country, startOfLastWeek, endOfLastWeek], (err, results) => {
      con.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      if (results.length === 0) {
        console.log("Country not found");
        res.status(404).send('Country not found');
      } else {
        res.json(results);
      }
    });
  });
});

app.get('/ur/:userId', (req, res) => {
  const userId = req.params.userId;
  const query = `SELECT (
      SELECT COUNT(DISTINCT Score) + 1
      FROM leaderboard AS t2
      WHERE t2.Score > t1.Score
    ) AS player_rank
    FROM leaderboard AS t1
    WHERE UID = ?
    ORDER BY Score DESC`;

  pool.getConnection((err, con) => {
    if (err) {
      console.error('Error acquiring a connection:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    con.query(query, [userId], (err, results) => {
      con.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      if (results.length === 0) {
        res.status(404).send('User ID not found');
      } else {
        res.json(results);
      }
    });
  });
});

app.listen(4000, () => {
  console.log("Server is running on Port: 4000");
});
