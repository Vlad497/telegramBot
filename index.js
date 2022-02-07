const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options.js");
const token = "5183363734:AAE7H6ys4xuRzaAu76JanTW21iNJX8WrQLo";

const bot = new TelegramApi(token, { polling: true });
const chats = {};


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "Сейчас я загадаю число от 0 до 9, а ты попробуй отгадать");
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Отгадывай", gameOptions);
}




const start = () => {
    bot.setMyCommands([

        { command: "/start", description: "Приветствие" },
        { command: "/info", description: "Информация о пользователе" },
        { command: "/game", description: "Игра 'Угадай цифру'" }

    ]);

    bot.on("message", async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === "/start") {
            await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/80a/5c9/80a5c9f6-a40e-47c6-acc1-44f43acc0862/9.webp")
            return bot.sendMessage(chatId, `Добро пожаловать в мой телеграм бот`);
        }
        if (text === "/info") {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
        }
        if (text === "/game") {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй ещё раз");
    });

    bot.on("callback_query", async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === "/again") {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
        } else {
            return await bot.sendMessage(chatId, `К сожалению, ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions);
        }
    })
}

start();