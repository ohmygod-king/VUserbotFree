const fs = require("fs");
const path = require("path");
const Logger = require("../Utils/Logger");

const COMMANDS_DIR = path.join(__dirname, "..", "Commands");

function scanDir(dir) {
  const found = [];
  if (!fs.existsSync(dir)) return found;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      found.push(...scanDir(fullPath));
      continue;
    }
    
    if (!entry.name.endsWith(".js")) continue;
    
    const relative = path.relative(COMMANDS_DIR, fullPath);
    const categoryFromPath = relative.split(path.sep)[0];
    
    found.push({ fullPath, categoryFromPath });
  }
  
  return found;
}

async function loadCommands(bot) {
  const files = scanDir(COMMANDS_DIR);
  const commands = [];
  const seenNames = new Map();
  
  for (const { fullPath, categoryFromPath } of files) {
    let mod;
    try {
      delete require.cache[require.resolve(fullPath)];
      mod = require(fullPath);
    } catch (err) {
      Logger.error(`Gagal load command file: ${fullPath}`, err);
      continue;
    }
    
    if (!mod || typeof mod.name !== "string" || typeof mod.execute !== "function") {
      Logger.warn(`Dilewati (format tidak valid): ${fullPath}`);
      continue;
    }
    
    const command = {
      name: mod.name.toLowerCase(),
      aliases: (mod.aliases || []).map((a) => a.toLowerCase()),
      category: mod.category || categoryFromPath || "Uncategorized",
      description: mod.description || "",
      usage: mod.usage || mod.name,
      ownerOnly: !!mod.ownerOnly,
      groupOnly: !!mod.groupOnly,
      privateOnly: !!mod.privateOnly,
      adminOnly: !!mod.adminOnly,
      premiumOnly: !!mod.premiumOnly,
      hidden: !!mod.hidden,
      cooldown: typeof mod.cooldown === "number" ? mod.cooldown : 0,
      execute: mod.execute,
      filePath: fullPath,
      registerCallback: typeof mod.registerCallback === "function" ? mod.registerCallback : null,
      registerInline: typeof mod.registerInline === "function" ? mod.registerInline : null,
    };
    
    const allKeys = [command.name, ...command.aliases];
    let conflict = false;
    for (const key of allKeys) {
      if (seenNames.has(key)) {
        Logger.error(
          `Bentrok nama/alias "${key}" antara "${seenNames.get(key)}" dan "${fullPath}" — command ini dilewati.`
        );
        conflict = true;
        break;
      }
    }
    if (conflict) continue;
    
    for (const key of allKeys) seenNames.set(key, fullPath);
    
    commands.push(command);
    Logger.debug(`Loaded command: ${command.name} (${command.category})`);
  }
  
  return commands;
}

module.exports = { loadCommands, scanDir };