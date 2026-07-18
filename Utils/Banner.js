const chalk = require("chalk");
const os = require("os");
const Config = require("../Config");

function formatBytes(bytes) {
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(1)} MB`;
}

function getCpuUsage() {
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;
  for (const cpu of cpus) {
    for (const type in cpu.times) total += cpu.times[type];
    idle += cpu.times.idle;
  }
  const usage = 100 - Math.round((idle / total) * 100);
  return `${usage}%`;
}

async function show({ client, totalCommands, totalHandlers }) {
  const startTime = Date.now();

  const me = await client.getMe();
  const account = me.username ? `@${me.username}` : me.phone || "Unknown";

  const gramjsPkg = require("telegram/package.json");
  const xzcgramPkg = require("xzcgram/package.json");

  const logo = `
${chalk.magentaBright("__     __                       ")}
${chalk.magentaBright("\\ \\   / /___   __ _ _   _  ___  ")}
${chalk.magentaBright(" \\ \\ / // _ \\ / _` | | | |/ _ \\ ")}
${chalk.magentaBright("  \\ V /| (_) | (_| | |_| |  __/ ")}
${chalk.magentaBright("   \\_/  \\___/ \\__, |\\__,_|\\___| ")}
${chalk.magentaBright("                 |_|             ")}
`;

  const line = chalk.gray("─".repeat(46));

  const rows = [
    ["Userbot Name", Config.botName],
    ["Version", Config.version],
    ["Developer", Config.developer.name],
    ["Telegram Username", Config.developer.telegram],
    ["Session Type", Config.sessionType],
    ["Prefix", Config.prefix],
    ["Total Commands", String(totalCommands)],
    ["Total Handlers", String(totalHandlers)],
    ["Connected Account", account],
    ["Node.js Version", process.version],
    ["XzcgraM Version", xzcgramPkg.version],
    ["GramJS Version", gramjsPkg.version],
    ["Platform", `${os.platform()} (${os.arch()})`],
    ["Memory Usage", formatBytes(process.memoryUsage().rss)],
    ["CPU Usage", getCpuUsage()],
  ];

  console.log(logo);
  console.log(line);
  for (const [label, value] of rows) {
    console.log(`${chalk.cyan(label.padEnd(20))} : ${chalk.white(value)}`);
  }
  console.log(line);
  console.log(chalk.green(`Startup completed in ${Date.now() - startTime}ms`));
  console.log(line);
}

module.exports = { show };