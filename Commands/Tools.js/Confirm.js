module.exports = {
  name: "confirminline",
  category: "Tools",
  description: "Contoh inline query dengan tombol konfirmasi",
  usage: "@namabot confirm",
  hidden: true,

  execute: async (ctx) => {
    await ctx.reply("Fitur ini dipakai lewat inline query, ketik @namabot confirm di chat manapun.");
  },

  registerInline(inlineApi) {
    inlineApi.register(/confirm/i, async (ctx) => {
      await ctx.answerArticles([
        {
          id: "confirm",
          title: "Konfirmasi Aksi",
          description: "Tap untuk memilih Ya atau Tidak",
          text: "Pilih salah satu opsi di bawah.",
          buttons: [
            [
              { text: "Ya", data: "confirminline:yes" },
              { text: "Tidak", data: "confirminline:no" },
            ],
          ],
        },
      ]);
    });
  },

  registerCallback(callbackApi) {
    callbackApi.register("confirminline:", async (ctx) => {
      const choice = ctx.data.split(":")[1];
      await ctx.editMessageText(choice === "yes" ? "Kamu memilih Ya." : "Kamu memilih Tidak.");
      await ctx.answer(choice === "yes" ? "Dikonfirmasi." : "Dibatalkan.");
    });
  },
};