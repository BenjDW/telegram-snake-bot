import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const db = {
  pool,
  async upsertUser(u: { telegram_id: number; username?: string | undefined; first_name?: string; last_name?: string | undefined; }) {
    const q = `
      INSERT INTO users (telegram_id, username, first_name, last_name)
      VALUES ($1,$2,$3,$4)
      ON CONFLICT (telegram_id)
      DO UPDATE SET username=EXCLUDED.username, first_name=EXCLUDED.first_name, last_name=EXCLUDED.last_name
      RETURNING id, telegram_id, username, first_name, last_name, created_at
    `;
    const { rows } = await pool.query(q, [u.telegram_id, u.username, u.first_name, u.last_name]);
    return rows[0];
  },
  async getOrCreateUserByTelegramId(tid: number, profile?: {username?: string | undefined; first_name?: string; last_name?: string | undefined}) {
    return this.upsertUser({ telegram_id: tid, ...profile });
  },
  async addScore(userId: number, score: number) {
    const { rows } = await pool.query(
      `INSERT INTO scores (user_id, score) VALUES ($1,$2) RETURNING id, user_id, score, created_at`,
      [userId, score]
    );
    return rows[0];
  },
  async getRecentScores(userId: number, limit = 10) {
    const { rows } = await pool.query(
      `SELECT score, created_at FROM scores WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2`,
      [userId, limit]
    );
    return rows;
  },
  async getLeaderboard(limit = 20) {
    const { rows } = await pool.query(
      `SELECT u.username, u.first_name, u.last_name, MAX(s.score) AS best_score
       FROM scores s JOIN users u ON u.id = s.user_id
       GROUP BY u.id
       ORDER BY best_score DESC
       LIMIT $1`,
      [limit]
    );
    return rows;
  }
};