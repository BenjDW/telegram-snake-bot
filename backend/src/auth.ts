// file handle the telegram auth token from @botfather with the unique id
import { parse, validate } from "@telegram-apps/init-data-node";

const BOT_TOKEN = process.env.BOT_TOKEN!;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN manquant");

export function validateInitData(qs: string) {
	// validate throw exception in case of error
	validate(qs, BOT_TOKEN);

	const initData = parse(qs);

	console.log("init data telegram after parse\nuser :", initData.user);
	return initData;
}