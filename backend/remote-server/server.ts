import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'remote_api',
  port: Number(process.env.DB_PORT) || 5432,
});

const APP_PORT = process.env.SERVER_PORT || 4001;

const app = express();
app.use(express.json());

async function initDatabase() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS user_status (
      user_status_id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE NOT NULL,
      is_vip BOOLEAN DEFAULT false
    );
  `;

  try {
    await pool.query(createTableSQL);
    console.log('table created!');
  } catch (err) {
    console.error('Error database:', err);
    process.exit(1);
  }
}

app.post('/api/saveUserStatus', async (req: Request, res: Response) => {
  const { user_id, status } = req.body;

  if (user_id === undefined || status === undefined) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    await pool.query(
      `INSERT INTO user_status (user_id, is_vip) VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET is_vip = EXCLUDED.is_vip`,
      [user_id, status],
    );
    res.status(200).json({ message: 'User status saved' });
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

app.get('/api/getUserStatus/:id', async (req: Request, res: Response) => {
  const userId = Number(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid param' });
  }

  try {
    const result = await pool.query(
      `SELECT is_vip FROM user_status WHERE user_id = $1`,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user_id: userId, status: result.rows[0].is_vip });
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

initDatabase().then(() => {
  app.listen(APP_PORT, () => {
    console.log(`REMOTE API started: http://localhost:${APP_PORT}`);
  });
});
