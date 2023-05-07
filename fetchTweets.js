const axios = require('axios');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

async function insertTweet(tweetInfo) {
  const query = `
    INSERT INTO tweets (tweet_id, created_at, type, full_text, reply_count, favorite_count, retweet_count, view_count)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (tweet_id) DO NOTHING;
  `;

  const values = [
    tweetInfo.tweetId,
    tweetInfo.createdAt,
    tweetInfo.type,
    tweetInfo.fullText,
    tweetInfo.replyCount,
    tweetInfo.favoriteCount,
    tweetInfo.retweetCount,
    tweetInfo.viewCount,
  ];

  try {
    await pool.query(query, values);
  } catch (error) {
    console.error('Error inserting tweet:', error);
  }
}

async function fetchLatestTweets() {
  const APIFLY_TOKEN = process.env.APIFLY_TOKEN;
  if (!APIFLY_TOKEN) {
    console.error('Please set the APIFLY_TOKEN environment variable.');
    process.exit(1);
  }

  const url = `https://api.apify.com/v2/acts/quacker~twitter-scraper/runs/last/dataset/items?token=${APIFLY_TOKEN}`;

  try {
    const response = await axios.get(url);
    const tweets = response.data;

    tweets.forEach(async tweet => {
      const tweetInfo = {
        tweetId: tweet.id,
        createdAt: tweet.created_at,
        type: tweet.is_quote_tweet ? 'quote' : (tweet.is_retweet ? 'retweet' : 'tweet'),
        fullText: tweet.full_text,
        replyCount: tweet.reply_count,
        favoriteCount: tweet.favorite_count,
        retweetCount: tweet.retweet_count,
        viewCount: tweet.view_count
      };
      await insertTweet(tweetInfo);
      //console.log(tweetInfo);
    });

  } catch (error) {
    console.error('Error fetching tweets:', error);
  }
}

fetchLatestTweets();
