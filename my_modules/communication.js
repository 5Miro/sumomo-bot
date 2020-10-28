const userController = require("../controllers/userController");
const globals = require("../globals");
const strings = require("../strings");

const CONVERSATIONS = [
    { context: "marriage", input: /\bare now married\b/, output: strings.MARRIAGE, reaction: "🎉" },
    { context: "divorce", input: /\bare now divorced\b/, output: strings.DIVORCE, reaction: "😱" },
    { context: "surprise", input: /\bnooo+\b/, output: strings.SURPRISE, reaction: "😱" },
    { context: "trade", input: /\btraded\b/, output: strings.TRADE, reaction: "🤩" },
    { context: "gift", input: /\bjust gifted\b/, output: strings.GIFT, reaction: "🥴" },
]

module.exports = {
    name: "communication",
    isActivated: true,
    OnInterval() {
        // This function will be called periodically.

    },
    OnMessage(message) {
        // This function will be called when a message is read.

        // If a message starts with the prefix
        if (message.content.startsWith(globals.prefix)) return;
        // If a message comes from bot itself.
        if (message.author.id == global.client.user.id) return;

        // CONVERSATIONS based on context
        CONVERSATIONS.forEach(element => {
            if (element.input.test(message.content.toLowerCase())) {
                message.react(element.reaction);
                message.channel.send(element.output[Math.floor(Math.random() * element.output.length)]);
                return;
            }
        });
    }
}