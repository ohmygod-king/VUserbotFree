module.exports = {
  name: "ping",
  aliases: ["p"],
  category: "General",
  description: "Cek kecepatan respon bot",
  usage: "ping",
  cooldown: 3,
  execute: async (ctx) => {
    const start = Date.now();
    const sent = await ctx.reply("Pinging...");
    const latency = Date.now() - start;
    await ctx.client.editMessage(ctx.chatId, {
      message: sent.id,
      text: `Pong! ${latency}ms`,
    });
  },
};