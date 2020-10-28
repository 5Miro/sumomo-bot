const userController = require("../controllers/userController");
const globals = require("../globals");

/**
 * How does friendship work? Well, similar to Pokemon games.
 * Min value: 0
 * Max value: 255
 * base value: 70
 * Gain or lose points depending on the content of the message.
 */

const POSITIVE_KEY_WORDS = ["sumomo", "gracias", "de nada"];
const DEFAULT_GAIN = 1;
const BONUS_GAIN = 3;

module.exports = {
    name: "friendship",
    isActivated: false,
    OnInterval() {
        // This function will be called periodically.

    },
    OnMessage(message) {
        // If a message starts with the prefix
        if (message.content.startsWith(globals.prefix)) return;
        // This function will be called when a message is read.
        if (message.author.username != "Miro") return;

        // By default
        var modifier = DEFAULT_GAIN;

        // If there's at least 1 positive key word.
        if (POSITIVE_KEY_WORDS.some(word => message.content.includes(word.toLowerCase()))) {
            modifier = BONUS_GAIN;
            message.react("❤");
        }
        userController.updateFriendship(message, modifier);
    }
}