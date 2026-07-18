module.exports = {
  name: "stickerinline",
  category: "Tools",
  description: "Contoh inline query mengirim gambar",
  usage: "@namabot gambar <kata kunci>",
  hidden: true,

  execute: async (ctx) => {
    await ctx.reply("Fitur ini dipakai lewat inline query, ketik @namabot gambar <kata kunci>.");
  },

  registerInline(inlineApi) {
    inlineApi.register(/^gambar/i, async (ctx) => {
      const keyword = ctx.query.replace(/^gambar\s*/i, "").trim() || "default";

      await ctx.answerArticles([
        {
          id: "img-1",
          title: `Hasil untuk "${keyword}"`,
          mediaType: "photo",
          mediaUrl: `https://picsum.photos/seed/${encodeURIComponent(keyword)}/600/400`,
          text: `Gambar: ${keyword}`,
        },
      ]);
    });
  },
};