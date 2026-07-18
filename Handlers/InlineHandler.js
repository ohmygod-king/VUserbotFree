function attach(bot) {
  const handlers = [];

  bot.inlineQuery(async (ctx) => {
    for (const { pattern, handler } of handlers) {
      const matched = !pattern || (pattern instanceof RegExp ? pattern.test(ctx.query) : ctx.query.includes(pattern));
      if (matched) return handler(ctx);
    }
  });

  return {
    register(pattern, handler) {
      handlers.push({ pattern, handler });
    },
  };
}

module.exports = { attach };