const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const Config = require("../Config");

const LOGS_DIR = path.join(__dirname, "..", "Logs");
if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });

function timestamp() {
  return new Date().toLocaleString("id-ID", { timeZone: Config.timezone || "Asia/Jakarta" });
}

function writeToFile(level, message) {
  if (!Config.logToFile) return;
  const filename = new Date().toISOString().slice(0, 10) + ".log";
  const line = `[${timestamp()}] [${level.toUpperCase()}] ${message}\n`;
  fs.appendFile(path.join(LOGS_DIR, filename), line, () => {});
}

function format(level, color, message) {
  const ts = chalk.gray(`[${timestamp()}]`);
  const tag = Config.logColor ? color(`[${level}]`) : `[${level}]`;
  return `${ts} ${tag} ${message}`;
}

function info(message) {
  console.log(format("INFO", chalk.cyan, message));
  writeToFile("info", message);
}

function success(message) {
  console.log(format("SUCCESS", chalk.green, message));
  writeToFile("success", message);
}

function warn(message) {
  console.log(format("WARN", chalk.yellow, message));
  writeToFile("warn", message);
}

function error(message, err) {
  const detail = err instanceof Error ? `${err.message}\n${err.stack}` : err ? String(err) : "";
  console.log(format("ERROR", chalk.red, message));
  if (detail) console.log(chalk.red(detail));
  writeToFile("error", detail ? `${message} | ${detail}` : message);
}

function debug(message) {
  if (process.env.DEBUG !== "true") return;
  console.log(format("DEBUG", chalk.magenta, message));
  writeToFile("debug", message);
}

function command({ username, command: cmdName, chatId, execTimeMs }) {
  const parts = [
    chalk.blueBright(`@${username || "unknown"}`),
    chalk.white(`ran`),
    chalk.yellowBright(`/${cmdName}`),
    chalk.gray(`in ${chatId}`),
    chalk.green(`(${execTimeMs}ms)`),
  ];
  console.log(`${chalk.gray(`[${timestamp()}]`)} ${Config.logColor ? chalk.cyan("[CMD]") : "[CMD]"} ${parts.join(" ")}`);
  writeToFile("cmd", `${username} ran /${cmdName} in ${chatId} (${execTimeMs}ms)`);
}

module.exports = { info, success, warn, error, debug, command };