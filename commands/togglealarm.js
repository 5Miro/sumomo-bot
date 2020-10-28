const mongoose = require("mongoose");
const userController = require("../controllers/userController");
const strings = require("../strings");

module.exports = {
    name: "togglealarm",
    descrip: "Recibe un DM cuando se reseteen tus rolls y claims de Mudae.",
    execute(message) {
        userController.toggleAlarm(message).then(doc => {
            if (doc.mudae_alarm) {
                message.channel.send(message.author.username + strings.SUBSCRIBED);
            } else {
                message.channel.send(message.author.username + strings.UNSUBSCRIBED);
            }
        });
    }
}