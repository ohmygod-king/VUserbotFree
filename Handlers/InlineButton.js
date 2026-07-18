const { Api } = require("telegram");

function switchInlineButton(text, query = "", sameChat = true) {
  return new Api.KeyboardButtonSwitchInline({
    text,
    query,
    samePeer: sameChat,
  });
}

function buildSwitchInlineMarkup(rows) {
  return new Api.ReplyInlineMarkup({
    rows: rows.map(
      (row) =>
        new Api.KeyboardButtonRow({
          buttons: row.map((btn) =>
            btn.switchInline !== undefined
              ? switchInlineButton(btn.text, btn.switchInline, btn.sameChat !== false)
              : btn
          ),
        })
    ),
  });
}

module.exports = { switchInlineButton, buildSwitchInlineMarkup };