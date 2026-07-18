const { isOwner } = require("../../Handlers/CommandRegistry");

module.exports = {
  name: "eval",
  aliases: ["ev"],
  category: "Owner",
  description: "Menjalankan kode JavaScript (owner only)",
  usage: "eval <kode>",
  ownerOnly: true,
  hidden: true,
  execute: async (ctx, args) => {
    const code = args.join(" ");
    if (!code) return ctx.reply("Masukkan kode yang mau dijalankan.");

    try {
      let result = eval(code);
      if (result instanceof Promise) result = await result;
      const output = typeof result === "string" ? result : require("util").inspect(result, { depth: 1 });
      await ctx.reply(`\`\`\`\n${output.slice(0, 3500)}\n\`\`\``, { parseMode: "markdown" });
    } catch (err) {
      await ctx.reply(`\`\`\`\n${err.message}\n\`\`\``, { parseMode: "markdown" });
    }
  },
};