const userController = require("../controllers/userController");
const globals = require("../globals");
const strings = require("../strings");

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
const LOSS_PER_INTERVAL = 1;
const INTERVAL_HOURS = 1;
const INITIAL_HOUR = 1;
const THRESHOLDS = [-1, 50, 100, 150, 200, 240, 255];

module.exports = {
    name: "friendship",
    isActivated: true,
    descrip: "Usuarios ganan o pierden puntos de amistad de Sumomo",
    OnInterval() {
        // This function will be called periodically.

        // Get current time and date.
        const date = new Date();
        if (date.getUTCMinutes() == 0 && date.getUTCSeconds() == 0) {  // First check MINUTES
            // Now check HOURS
            for (i = INITIAL_HOUR; i < globals.hours_per_day; i += INTERVAL_HOURS) {
                if (date.getUTCHours() == i) {
                    userController.updateFriendshipAll(LOSS_PER_INTERVAL);
                    return;
                }
            }
        }
    },
    OnMessage(message) {
        // This function will be called when a message is read.

        // If a message starts with the prefix
        if (message.content.startsWith(globals.prefix) || message.content.startsWith(globals.MUDAE_PREFIX)) return;

        // If user is bot, return
        if (message.author.bot) return;

        // By default
        var modifier = DEFAULT_GAIN;

        // If there's at least 1 positive key word.
        if (POSITIVE_KEY_WORDS.some(word => message.content.includes(word.toLowerCase()))) {
            modifier = BONUS_GAIN;
            message.react("❤");
        }
        userController.updateFriendship(message, modifier);
    },

    GetFriendship(message) {
        userController.readUser(message).then(user => {
            if (user) {
                for (let i = 0; i < THRESHOLDS.length - 1; i++) {
                    if (user.friendship > THRESHOLDS[i] && user.friendship <= THRESHOLDS[i + 1]) {
                        message.channel.send("Tu amistad con Sumomo es del " + Math.round(user.friendship / globals.FS_MAX_VALUE * 100) + "%. " + strings.FRIENDSHIP[i]);
                        message.channel.send(strings.GIFS.FRIENDSHIP[i]);
                    }
                }
            } else {
                userController.createUser(message).then(newUser => {
                    for (let i = 0; i < THRESHOLDS.length - 1; i++) {
                        if (newUser.friendship > THRESHOLDS[i] && newUser.friendship <= THRESHOLDS[i + 1]) {
                            message.channel.send("Tu amistad con Sumomo es del " + Math.round(newUser.friendship / globals.FS_MAX_VALUE * 100) + "%. " + strings.FRIENDSHIP[i]);
                            message.channel.send(strings.GIFS.FRIENDSHIP[i]);
                        }
                    }
                })
            }
        });

    }
}