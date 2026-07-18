const Logger = require("../Utils/Logger");

function groupByCategory(commands) {
  const grouped = {};
  for (const cmd of commands) {
    const key = cmd.category.toLowerCase();
    grouped[key] = grouped[key] || [];
    grouped[key].push(cmd);
  }
  return grouped;
}

function bind(commands, callbackApi, inlineApi) {
  const byCategory = groupByCategory(commands);

  for (const cmd of commands) {
    if (cmd.registerCallback) {
      try {
        cmd.registerCallback(callbackApi, byCategory);
      } catch (err) {
        Logger.error(`Gagal registerCallback untuk command "${cmd.name}"`, err);
      }
    }
    if (cmd.registerInline) {
      try {
        cmd.registerInline(inlineApi, byCategory);
      } catch (err) {
        Logger.error(`Gagal registerInline untuk command "${cmd.name}"`, err);
      }
    }
  }
}

module.exports = { bind, groupByCategory };