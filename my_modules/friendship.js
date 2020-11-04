const userController = require("../controllers/userController");
const globals = require("../globals");
const strings = require("../strings");

/**
 * How does friendship work? Well, similar to Pokemon games.
 * Min value: 0
 * Max value: 255
 * base value: 70
 * Gain or lose points depending on user's activity.
 */

const POSITIVE_KEY_WORDS = ["sumomo", "gracias", "de nada", "buen dia", "buenos dias", "hola", "buenas noches", "te quiero"];
const DEFAULT_GAIN = 1;
const BONUS_GAIN = 3;
const JOIN_VOICE_GAIN = 5;
const LOSS_PER_INTERVAL = -1;
const INTERVAL_HOURS = 1;
const INITIAL_HOUR = 1;
const THRESHOLDS = [-1, 50, 100, 150, 200, 240, 255];
const ON_CONNECTION_GREET_INDEX_TH = 3;

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
                    userController.updateFriendshipAll(LOSS_PER_INTERVAL, true);
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
        if (POSITIVE_KEY_WORDS.some(word => message.content.toLowerCase().includes(word.toLowerCase()))) {
            modifier = BONUS_GAIN;
            message.react("❤");
        }
        userController.updateFriendship(message.author.id, message.author.username, modifier);
    },

    OnVoiceStateUpdate(oldState, newState) {
        // if user just connected from a voice channel.
        if (oldState.channel === null && newState.channel !== null) {
            // Gain friendship points.
            userController.updateFriendship(newState.member.user.id, newState.member.user.username, JOIN_VOICE_GAIN);

            // If FS is above a certain threshold, say hello to user.
            userController.readUser(newState.member.user.id).then(doc => {
                if (doc.friendship > THRESHOLDS[ON_CONNECTION_GREET_INDEX_TH]) {
                    client.users.fetch(doc.user_id).then(user => {
                        user.send(doc.username + strings.HELLO[Math.floor(Math.random() * strings.HELLO.length)]).then(msg => {
                            // Delete message after timeout.
                            msg.delete({ timeout: globals.rolls_interval * 60 * 60 * 1000 }).catch(err => { // timeout is equal to rolls time interval in miliseconds.
                                console.log("No se ha podido borrar el mensaje.");
                            });
                        }).catch(err => {
                            console.log("No se ha podido enviar el PM\n" + err);
                        });
                    });
                }
            })


        }
    },

    GetFriendship(message) {
        userController.readUser(message.author.id).then(user => {
            if (user) {
                for (let i = 0; i < THRESHOLDS.length - 1; i++) {
                    if (user.friendship > THRESHOLDS[i] && user.friendship <= THRESHOLDS[i + 1]) {
                        message.channel.send("Tu amistad con Sumomo es del " + Math.round(user.friendship / globals.FS_MAX_VALUE * 100) + "%. " + strings.FRIENDSHIP[i]);
                        message.channel.send(strings.GIFS.FRIENDSHIP[i]);
                    }
                }
            } else {
                userController.createUser(message.author.id, message.author.username).then(newUser => {
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