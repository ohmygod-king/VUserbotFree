module.exports = {
  apiId: 123456,
  apiHash: "your_api_hash_here",
  sessionType: "store",
  sessionName: "vogue",
  session: "",
  botToken: "", // KOSONGIN AJA KALAU USERBOT!

  loginOptions: {
    phoneNumber: async () => "+62xxxxxxxxxx",
    password: async () => "",
    phoneCode: async () => "",
    onError: (err) => console.error("[Login Error]", err),
  },

  botName: "Vogue Userbot",
  prefix: ".",                          // prefix command, contoh: ".menu"
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