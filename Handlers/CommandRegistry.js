const Config = require("../Config");
const Logger = require("../Utils/Logger");

const cooldowns = new Map();

function isOwner(ctx) {
  return String(ctx.senderId) === String(Config.ownerId);
}

async function isAdmin(ctx) {
  try {
    const perms = await ctx.client.getPermissions(ctx.chatId, ctx.senderId);
    return !!(perms && (perms.isAdmin || perms.isCreator));
  } catch (err) {
    return false;
  }
}

function checkCooldown(command, ctx) {
  if (!command.cooldown) return 0;
  const key = `${command.name}:${ctx.senderId}`;
  const last = cooldowns.get(key) || 0;
  const remaining = command.cooldown * 1000 - (Date.now() - last);
  if (remaining > 0) return Math.ceil(remaining / 1000);
  cooldowns.set(key, Date.now());
  return 0;
}

function stripPrefix(text) {
  const prefix = Config.prefix || "/";
  if (!text.startsWith(prefix)) return null;
  return text.slice(prefix.length);
}

function attach(bot, commands) {
  const byName = new Map();
  for (const cmd of commands) {
    byName.set(cmd.name, cmd);
    for (const alias of cmd.aliases) byName.set(alias, cmd);
  }

  bot.on("message", async (ctx) => {
    const body = stripPrefix(ctx.text);
    if (body === null) return;

    const cmdName = body.split(" ")[0].toLowerCase();
    const args = body.split(" ").slice(1);
    const command = byName.get(cmdName);
    if (!command) return;

    if (command.ownerOnly && !isOwner(ctx)) {
      return ctx.reply("Perintah ini hanya untuk owner.");
    }
    if (command.groupOnly && ctx.isPrivate) {
      return ctx.reply("Perintah ini hanya bisa dipakai di grup.");
    }
    if (command.privateOnly && !ctx.isPrivate) {
      return ctx.reply("Perintah ini hanya bisa dipakai di chat pribadi.");
    }
    if (command.adminOnly && !isOwner(ctx) && !(await isAdmin(ctx))) {
      return ctx.reply("Perintah ini hanya untuk admin grup.");
    }

    const wait = checkCooldown(command, ctx);
    if (wait > 0) {
      return ctx.reply(`Tunggu ${wait} detik lagi sebelum memakai perintah ini.`);
    }

    const start = Date.now();
    try {
      await command.execute(ctx, args);
      Logger.command({
        username: ctx.senderId,
        command: command.name,
        chatId: ctx.chatId,
        execTimeMs: Date.now() - start,
      });
    } catch (err) {
      Logger.error(`Error menjalankan command "${command.name}"`, err);
      await ctx.reply("Terjadi kesalahan saat menjalankan perintah ini.").catch(() => {});
    }
  });

  return byName;
}

module.exports = { attach, isOwner, isAdmin };