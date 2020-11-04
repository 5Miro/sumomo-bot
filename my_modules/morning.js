const userController = require("../controllers/userController");
const globals = require("../globals");
const strings = require("../strings");

module.exports = {
    name: "morning",
    isActivated: true,
    descrip: "Sumomo da los buenos días por un canal público",
    OnInterval() {
        // This function will be called periodically.
        const date = new Date();
        if (date.getUTCHours() == globals.good_morning_time[0] && date.getUTCMinutes() == globals.good_morning_time[1] && date.getUTCSeconds() == globals.good_morning_time[2]) {
            global.client.channels.fetch(process.env.GOOD_MORNING_CHANNEL).then(channel => {
                channel.send(strings.GOOD_MORNING);
                channel.send(strings.GIFS.WAKEY_WAKEY[Math.floor(Math.random() * strings.GIFS.WAKEY_WAKEY.length)]);
            }).catch(err => {
                console.log("wakeywakey threw an exception" + err);
            })

        }
    },
    OnMessage(message) {
        // This function will be called when a message is read.
    },
    OnVoiceStateUpdate(oldState, newState) {

    }
}