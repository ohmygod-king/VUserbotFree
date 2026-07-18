const { Api } = require("telegram");
const { Raw } = require("telegram/events");
const Logger = require("../Utils/Logger");

function attach(client) {
  client.addEventHandler(async (update) => {
    try {
      switch (update.className) {
        case "UpdateChatParticipant":
        case "UpdateChannelParticipant": {
          const isJoin = !update.prevParticipant && update.newParticipant;
          const isLeave = update.prevParticipant && !update.newParticipant;
          if (isJoin) Logger.debug(`Member joined: ${update.userId}`);
          if (isLeave) Logger.debug(`Member left/removed: ${update.userId}`);
          break;
        }
        case "UpdatePinnedMessages":
        case "UpdatePinnedChannelMessages":
          Logger.debug(`Pinned message updated in peer ${update.peer || update.channelId}`);
          break;
        case "UpdateMessageReactions":
          Logger.debug(`Reaction updated on message ${update.msgId}`);
          break;
        case "UpdateBotStopped":
          Logger.debug(`Bot ${update.stopped ? "blocked" : "unblocked"} by ${update.userId}`);
          break;
        default:
          break;
      }
    } catch (err) {
      Logger.error("EventHandler error", err);
    }
  }, new Raw({}));
}

module.exports = { attach };