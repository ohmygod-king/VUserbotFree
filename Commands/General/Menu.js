const Config = require("../../Config");

module.exports = {
  name: "menu",
  aliases: ["help", "m"],
  category: "General",
  description: "Menampilkan daftar command",
  usage: "menu",
  cooldown: 3,
  execute: async (ctx) => {
    await ctx.replyWithButtons(
      `${Config.botName}\n\nPilih kategori command di bawah ini.`,
      [
        [{ text: "General", data: "menu:general" }, { text: "Owner", data: "menu:owner" }],
        [{ text: "Tools", data: "menu:tools" }],
      ]
    );
  },

  registerCallback(callbackRegistry, commandsByCategory) {
    callbackRegistry.register("menu:", async (ctx) => {
      const category = ctx.data.split(":")[1];
      const list = (commandsByCategory[category] || [])
        .filter((c) => !c.hidden)
        .map((c) => `${Config.prefix}${c.name} - ${c.description}`)
        .join("\n");

      await ctx.editMessageText(
        list ? `Kategori: ${category}\n\n${list}` : "Tidak ada command di kategori ini."
      );
      await ctx.answer();
    });
  },
};