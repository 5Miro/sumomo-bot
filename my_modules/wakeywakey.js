const userController = require("../controllers/userController");
const globals = require("../globals");
const strings = require("../strings");

module.exports = {
    name: "wakeywakey",
    isActivated: true,
    OnInterval() {
        // This function will be called periodically.
        const date = new Date();
        if (date.getUTCHours() == globals.good_morning_time[0] && date.getUTCMinutes() == globals.good_morning_time[1] && date.getUTCSeconds() == globals.good_morning_time[2]) {
            global.client.channels.fetch(process.env.GOOD_MORNING_CHANNEL).then(channel => {
                channel.send(strings.GOOD_MORNING);
                channel.send(strings.GIFS.WAKEY_WAKEY);
            }).catch(err => {
                console.log("wakeywakey threw an exception" + err);
            })
            
        }
    },
    OnMessage(message) {
        // This function will be called when a message is read.
    }
}