const readline = require("readline");

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

module.exports = {
  apiId: 123456,
  apiHash: "your_api_hash_here",
  
  sessionType: "store",
  sessionName: "vogue",
  session: "",
  
  botToken: "",
  
  botName: "Vogue Userbot",
  prefix: ".",
  version: "1.0.0",
  
  ownerId: 0,
  ownerUsername: "yourusername",
  ownerName: "Your Name",
  
  timezone: "Asia/Jakarta",
  language: "id",
  
  autoRead: false,
  autoReact: false,
  autoTyping: false,
  
  logColor: true,
  logToFile: true,
  
  showBanner: true,
  
  developer: {
    name: "Your Name",
    telegram: "@yourusername",
    github: "https://github.com/yourusername",
  },
};