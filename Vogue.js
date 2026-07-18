const { clientStart } = require("xzcgram");
const Config = require("./Config");

const Loader = require("./Handlers/Loader");
const CommandRegistry = require("./Handlers/CommandRegistry");
const CallbackRegistry = require("./Handlers/CallbackRegistry");
const InlineHandler = require("./Handlers/InlineHandler");
const EventHandler = require("./Handlers/EventHandler");
const EventBinder = require("./Handlers/EventBinder");

const Logger = require("./Utils/Logger");
const Banner = require("./Utils/Banner");

process.on("uncaughtException", (err) => {
  Logger.error("Uncaught Exception", err);
});
process.on("unhandledRejection", (reason) => {
  Logger.error("Unhandled Rejection", reason);
});

async function main() {
  Logger.info("Starting Vogue Userbot...");
  
  const { bot, client, sessionString } = await clientStart({
    apiId: Config.apiId,
    apiHash: Config.apiHash,
    botToken: Config.botToken || undefined,
    sessionType: Config.sessionType,
    session: Config.session,
    sessionName: Config.sessionName,
    loginOptions: Config.botToken ? undefined : Config.loginOptions,
  });
  
  if (sessionString) {
    Logger.warn("Simpan session string ini untuk login berikutnya:");
    console.log(sessionString);
  }
  
  const loadedCommands = await Loader.loadCommands(bot);
  
  CommandRegistry.attach(bot, loadedCommands);
  const callbackApi = CallbackRegistry.attach(bot);
  const inlineApi = InlineHandler.attach(bot);
  EventBinder.bind(loadedCommands, callbackApi, inlineApi);
  
  EventHandler.attach(client);
  
  await bot.launch();
  
  if (Config.showBanner) {
    await Banner.show({
      client,
      totalCommands: loadedCommands.length,
      totalHandlers: 4,
    });
  }
  
  Logger.success(`${Config.botName} is running.`);
}

main().catch((err) => {
  Logger.error("Fatal error during startup", err);
  process.exit(1);
});