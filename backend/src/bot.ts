import { Telegraf, Markup } from "telegraf";
import { db } from "./db.js";

const BOT_TOKEN = process.env.BOT_TOKEN!;
const WEBAPP_URL = process.env.WEBAPP_URL!; // exe: https://app.example.com
if (!BOT_TOKEN || !WEBAPP_URL) throw new Error("BOT_TOKEN ou WEBAPP_URL manquant");

export function createBot() {
  const bot = new Telegraf(BOT_TOKEN);

  bot.command("start", async (ctx) => {
    const u = ctx.from!;
    await db.getOrCreateUserByTelegramId(u.id, {
      username: u.username, first_name: u.first_name, last_name: u.last_name
    });
    await ctx.reply(
      "Bienvenue ! Utilise /app pour ouvrir le Snake, /profile pour tes scores, /leaderboard pour le top.",
    );
  });

  bot.command("app", async (ctx) => {
    await ctx.reply(
      "Ouvre le jeu :",
      Markup.inlineKeyboard([
        Markup.button.webApp("🎮 Ouvrir l’app", WEBAPP_URL)
      ])
    );
  });

  bot.command("profile", async (ctx) => {
    const u = ctx.from!;
    const user = await db.getOrCreateUserByTelegramId(u.id, {
      username: u.username, first_name: u.first_name, last_name: u.last_name
    });
    const recent = await db.getRecentScores(user.id, 5);
    const list = recent.map(r => `• ${r.score} pts (${new Date(r.created_at).toLocaleString()})`).join("\n") || "Aucun score.";
    await ctx.reply(`Tes derniers scores:\n${list}`);
  });

  bot.command("leaderboard", async (ctx) => {
    const top = await db.getLeaderboard(10);
    const lines = top.map((t: any, i: number) =>
      `${i+1}. ${t.username ?? t.first_name ?? "Anonyme"} — ${t.best_score} pts`
    ).join("\n") || "Aucun score.";
    await ctx.reply(`🏆 Leaderboard (meilleur score par joueur)\n${lines}`);
  });

  bot.catch(err => console.error("Bot error:", err));
  return bot;
}
