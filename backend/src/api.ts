//routes api front
// get exe : fetch('http://localhost:3000/api/users/42')
// post fetch('http://localhost:3000/api/scores', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ user: 'Albert', score: 1200 })
// })
// put , maj of the existing value
// delete
// patch modify partial value

//routes api with express
// app.use(express.json()) : read the json from the front
// get exe : app.get('/', (req, res) => {
//   res.send('Bienvenue sur le backend !')
// })
// 
// post app.post('/api/scores', (req, res) => {
//   const { user, score } = req.body
//   console.log('Nouveau score reçu :', user, score)
//   res.json({ message: 'Score enregistré avec succès !' })
// })
// put , maj of the existing value
// delete
// patch : modify partial value

import express from "express";
import cors from "cors";
import { validateInitData } from "./auth.js";
import { db } from "./db.js";

export function createApi() {
  const app = express();
  app.use(express.json());

  // Autorise n'importe quel connection exterieur (telegram, url etc), juste change origin par l'url pour cible
  app.use(cors({ origin: "*" }));

  app.get("/healthz", (_, res) => res.json({ ok: true }));

  // Auth via initData (query string renvoyée par Telegram)
  app.get("/api/profile", async (req, res) => {
    try {
      const initQS = req.query.initData as string || req.header("X-TG-InitData") || "";
      const initData = validateInitData(initQS);
      const u = initData.user!;
      const user = await db.getOrCreateUserByTelegramId(u.id, {
        username: u.username, first_name: u.first_name, last_name: u.last_name
      });
      const recent = await db.getRecentScores(user.id, 10);
      res.json({ user, recent });
    } catch (e: any) {
      res.status(401).json({ error: "invalid initData", detail: e?.message });
    }
  });

  app.post("/api/score", async (req, res) => {
    try {
      const initQS = req.query.initData as string || req.header("X-TG-InitData") || "";
      const initData = validateInitData(initQS);
      const u = initData.user!;
      const user = await db.getOrCreateUserByTelegramId(u.id, {
        username: u.username, first_name: u.first_name, last_name: u.last_name
      });

      const { score } = req.body as { score: number };
      if (typeof score !== "number" || score < 0) return res.status(400).json({ error: "bad score" });

      const saved = await db.addScore(user.id, score);
      res.json(saved);
    } catch (e: any) {
      res.status(401).json({ error: "invalid initData", detail: e?.message });
    }
  });

  app.get("/api/leaderboard", async (_req, res) => {
    const top = await db.getLeaderboard(20);
    res.json(top);
  });

  return app;
}