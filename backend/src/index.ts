// main file
import { createApi } from "./api.js";
import { createBot } from "./bot.js";

const PORT = 3000;

const app = createApi();
app.listen(PORT, () => console.log(`API on :${PORT}`));

const bot = createBot();
// On reste en long polling (telegram)
bot.launch().then(() => console.log("Bot started (long polling)"));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));