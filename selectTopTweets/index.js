const express = require('express');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const app = express();

app.get('/top-tweets', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM tweets
      WHERE type != 'retweet'
      AND created_at >= NOW() - INTERVAL '1 month'
      ORDER BY favorite_count DESC;
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching top tweets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log('Top Tweets service listening on port 3000');
});
