const Logger = require("../Utils/Logger");

function attach(bot) {
  const prefixMap = [];
  
  bot.action(/.*/, async (ctx) => {
    const sorted = prefixMap.slice().sort((a, b) => b.prefix.length - a.prefix.length);
    const match = sorted.find((entry) => ctx.data.startsWith(entry.prefix));
    
    if (!match) {
      return ctx.answer("Tombol ini sudah tidak berlaku.").catch(() => {});
    }
    
    try {
      await match.handler(ctx);
    } catch (err) {
      Logger.error(`Error di callback "${match.prefix}"`, err);
      return ctx.answer("Terjadi kesalahan.").catch(() => {});
    } finally {
      if (!ctx._answered) {
        await ctx.answer().catch(() => {});
      }
    }
  });
  
  return {
    register(prefix, handler) {
      const wrapped = async (ctx) => {
        const originalAnswer = ctx.answer.bind(ctx);
        ctx.answer = async (...args) => {
          ctx._answered = true;
          return originalAnswer(...args);
        };
        return handler(ctx);
      };
      prefixMap.push({ prefix, handler: wrapped });
    },
  };
}

module.exports = { attach };