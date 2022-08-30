const TelegramBot = require('node-telegram-bot-api')
const TOKEN = process.env.TOKEN
const path = require('path')
const sqlite3 = require('sqlite3').verbose()
const dbpath = path.resolve(__dirname, './model/words.db')
const usersDBPath = path.resolve(__dirname, './model/users.db')
const db = new sqlite3.Database(dbpath)
const usersDB = new sqlite3.Database(usersDBPath)
const adminChatId = 576049148;

let stepMessage = 0
let isSearch = true
let message


// host name
const url = 'https://sammy.uz';
const options = {
    polling: true
    // webHook: {
    //     port: process.env.PORT,
    //     key: `${__dirname}/ssl/key.pem`,
    //     cert: `${__dirname}/ssl/crt.pem`
    // }
  };
const bot = new TelegramBot(TOKEN, options)

module.exports = {
    startBot: function () {
        // bot.setWebHook(`${url}/bot${TOKEN}`, {
        //     certificate: options.webHook.cert,
        // });
        bot.on("error", (msg) => bot.sendMessage(adminChatId, `Error: Bot ishlamayapdi!!! \nAdmin qayta ishga tushiring! \n${msg}`))

        bot.on("polling_error", (msg) => bot.sendMessage(adminChatId, `Polling error: Bot ishlamayapdi!!! \nAdmin qayta ishga tushiring! \n${msg}`))

        bot.onText(/\/start/, (msg) => {
            const chatId = msg.chat.id
            const username = msg.chat.first_name
            if (chatId === adminChatId) {
                bot.sendMessage(chatId, `Salom Admin, xush kelibsiz`, {
                    reply_markup: {
                        keyboard: [
                            [`📋Xabar yuborish`],
                        ],
                        resize_keyboard: true,
                    }
                })
            } else {
                bot.sendMessage(chatId, `Salom ${username}, botimizga xush kelibsiz! \nSo'zni kiriting...`)
            }
        })

        bot.on('callback_query', query => {
            const chatId = query.message.chat.id
            const data = query.data
            const messageId = query.message.message_id
            if (data === 'send') {
                usersDB.all(`SELECT chatId FROM users`, (err, row) => {
                    if (err) {
                        console.log(err)
                    } else {
                        if (row) {
                            function sendMsg(startIndex) {
                                for (i = startIndex || 0; i < row.length; i++) {
                                    if (i === 20) {
                                        setTimeout(() => {
                                            sendMsg(i);
                                        }, 60000)
                                        break;
                                    }
                                    if (message.photo && message.caption) {
                                        bot.sendMediaGroup(row[i].chatId, [{
                                            type: 'photo',
                                            media: message.photo[1].file_id,
                                            caption: message.caption,
                                            parse_mode: 'HTML'
                                        }])
                                    } else if (message.photo) {
                                        bot.sendPhoto(row[i].chatId, message.photo[1].file_id, {
                                            parse_mode: 'HTML'
                                        })
                                    } else {
                                        bot.sendMessage(row[i].chatId, message.text, {
                                            parse_mode: 'HTML'
                                        })
                                    }
                                }
                            }
                            sendMsg(0);
                        }
                    }
                })
                setTimeout(() => {
                    bot.sendMessage(chatId, `Xabar yuborildi!, qidirilayotgan so'zni kiriting`, {
                        reply_markup: {
                            keyboard: [
                                [`📋Xabar yuborish`],
                            ],
                            resize_keyboard: true,
                        }
                    })
                }, 500)
                bot.deleteMessage(chatId, messageId - 1)
                bot.deleteMessage(chatId, messageId)
            }
            if (data === 'cancel') {
                bot.sendMessage(chatId, `Xabar yuborish bekor qilindi!, qidirilayotgan so'zni kiriting`, {
                    reply_markup: {
                        keyboard: [
                            [`📋Xabar yuborish`],
                        ],
                        resize_keyboard: true,
                    }
                })
                bot.deleteMessage(chatId, messageId)
            }
            isSearch = true
            stepMessage = 0
        })

        bot.on('message', (msg) => {
            const chatId = msg.chat.id
            let text = msg.text
            if (text === '📋Xabar yuborish' && chatId === adminChatId) {
                isSearch = false
                stepMessage += 1
                bot.sendMessage(chatId, 'Xabarni kiriting', {
                    reply_markup: {
                        keyboard: [
                            [`❌Bekor qilish`],
                        ],
                        resize_keyboard: true,
                    }
                })
            }
            if (text === `❌Bekor qilish` && chatId === adminChatId) {
                isSearch = true
                stepMessage = 0
                bot.sendMessage(chatId, `Bekor qilindi, qidirilayotgan so'zni kiriting`, {
                    reply_markup: {
                        keyboard: [
                            [`📋Xabar yuborish`],
                        ],
                        resize_keyboard: true,
                    }
                })
            }
            usersDB.get(`SELECT * FROM users WHERE chatId = "${chatId}"`, (err, row) => {
                if (err) {
                    console.log(err)
                } else {
                    if (!row) {
                        usersDB.run(`INSERT INTO users (chatId, name, userName) VALUES ("${chatId}", "${msg.chat.first_name}", "${msg.chat.username || ""}")`)
                    }
                }
            })

            if (text !== '📋Xabar yuborish' && stepMessage === 1) {
                message = msg
                if (msg.photo && msg.caption) {
                    bot.sendMediaGroup(chatId, [{
                        type: 'photo',
                        media: msg.photo[1].file_id,
                        caption: msg.caption,
                        parse_mode: 'HTML'
                    }])
                } else if (msg.photo) {
                    bot.sendPhoto(chatId, msg.photo[1].file_id)
                } else {
                    bot.sendMessage(chatId, text)
                }
                setTimeout(() => {
                    bot.sendMessage(chatId, `Xabarni tasdiqlang!`, {
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                        text: `Jo'natish`,
                                        callback_data: 'send'
                                    },
                                    {
                                        text: `Bekor qilish`,
                                        callback_data: 'cancel'
                                    }
                                ]
                            ]
                        }
                    })
                }, 500)
            }

            if (text !== '/start' && isSearch && text !== '❌Bekor qilish') {
                text.split('').forEach(letter => {
                    if (letter === `'`) {
                        text = text.replace(/'/g, 'ʻ')
                    } else if (letter === `"`) {
                        bot.sendMessage(chatId, `Iltimos so'zni tekshirib qaytadan kiriting...`)
                    }
                })
                db.get(`SELECT * FROM izohlar WHERE word LIKE "${text}"`, async (err, row) => {
                    if (err) {
                        console.log(err)
                    } else {
                        if (row) {
                            if (row.definition) {
                                bot.sendMessage(chatId, `So'z izohi\n\n<b>${row.word}</b> - ${row.definition} \n${row.fulldefinition}\n\n@Izohli_lugati_bot`, {
                                    parse_mode: 'HTML'
                                }).catch(err => console.log(err))
                            } else {
                                bot.sendMessage(chatId, `So'z izohi yo'q!!!`)
                            }
                        } else {
                            bot.sendMessage(chatId, `So'z topilmadi!`)
                        }
                    }
                })
            }

        })
    }
}