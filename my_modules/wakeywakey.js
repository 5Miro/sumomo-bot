const userController = require("../controllers/userController");
const globals = require("../globals");
const strings = require("../strings");

module.exports = {
    name: "wakeywakey",
    isActivated: true,
    OnInterval() {
        // This function will be called periodically.
        const date = new Date();
        if (date.getUTCHours() == globals.good_morning_time && date.getUTCMinutes == 0 && date.getUTCSeconds == 0) {
            global.client.channels.fetch(process.env.good_morning_channel).send(strings.GOOD_MORNING);
            global.client.channels.fetch(process.env.good_morning_channel).send(strings.GIFS.WAKEY_WAKEY);
        }
    },
    OnMessage(message) {
        // This function will be called when a message is read.
    }
}