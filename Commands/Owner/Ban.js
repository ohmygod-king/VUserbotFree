module.exports = {
  name: "ban",
  category: "Owner",
  description: "Ban user dari supergroup/channel (bukan basic group)",
  usage: "ban <reply/user_id>",
  ownerOnly: true,
  groupOnly: true,
  execute: async (ctx, args) => {
    let targetId = args[0];

    if (!targetId && ctx.isReply) {
      const replied = await ctx.replyMessage;
      targetId = replied[0]?.senderId;
    }

    if (!targetId) {
      return ctx.reply("Reply pesan target atau sertakan user ID. Contoh: .ban 123456789");
    }

    try {
      await ctx.banUser(targetId);
      await ctx.reply("User berhasil di-ban.");
    } catch (err) {
      await ctx.reply(
        "Gagal ban user. Perlu diingat: perintah ini hanya bekerja di supergroup/channel, bukan grup basic (lama)."
      );
    }
  },
};