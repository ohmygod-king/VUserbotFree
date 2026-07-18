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

function buildLoginOptions() {
  return {
    phoneNumber: async () => {
      console.log("Menghubungkan ke Telegram...");
      return ask("Masukkan nomor telepon (contoh +628xxxx): ");
    },
    phoneCode: async () => {
      console.log("Kode OTP sedang dikirim ke akun Telegram kamu...");
      return ask("Masukkan kode OTP yang baru saja masuk: ");
    },
    password: async () => {
      return ask("Akun ini memakai 2FA. Masukkan password (kosongkan jika tidak yakin): ");
    },
    onError: (err) => console.error("[Login Error]", err.message || err),
  };
}

module.exports = { buildLoginOptions, ask };