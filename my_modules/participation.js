const userController = require("../controllers/userController");
const globals = require("../globals");
const strings = require("../strings");

const CONVERSATIONS = [
    { context: "marriage", input: /\bare now married\b/, output: strings.MARRIAGE, reaction: "🎉", gif: strings.GIFS.DANCE },
    { context: "divorce", input: /\bare now divorced\b/, output: strings.DIVORCE, reaction: "😱", gif: null },
    { context: "surprise", input: /\bnooo+\b/, output: strings.SURPRISE, reaction: "😱", gif: null },
    { context: "trade", input: /(\bexchange is over\b)|(\b(given to)\b)/, output: strings.TRADE, reaction: "🤩", gif: null },
    { context: "gift", input: /(\b(just gifted)\b)/, output: strings.GIFT, reaction: "🥴", gif: null },
    { context: "monokuma", input: /\bmonokuma\b/, output: strings.MONOKUMA, reaction: "😟", gif: null },
]

module.exports = {
    name: "participation",
    isActivated: true,
    descrip: "Sumomo participa de las conversaciones entre usuarios",
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
                if (element.gif) {
                    message.channel.send(element.gif[Math.floor(Math.random() * element.gif.length)]);
                }
                return;
            }
        });
    },
    OnVoiceStateUpdate(oldState, newState) {

    }
}