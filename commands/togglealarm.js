const mongoose = require("mongoose");
const userController = require("../controllers/userController");
const strings = require("../strings");

module.exports = {
    name: "togglealarm",
    descrip: "Recibe un DM cuando se reseteen tus rolls y claims de Mudae.",
    execute(message) {
        // Read DB and look for user.
        userController.readUser(message).then(doc => {
            // User exists in DB.
            if (doc) {
                // This user exists. Toggle alarm value.
                userController.toggleAlarm(doc._id, message, doc.mudae_alarm).then(doc2 => {
                    // If new value is true, then user is now suscribed, else.
                    if (doc2.mudae_alarm) {
                        message.channel.send(message.author.username + strings.SUBSCRIBED);
                    } else {
                        message.channel.send(message.author.username + strings.UNSUBSCRIBED);
                    }
                }).catch(err => {
                    console.log("Excepción arrojada por toggleAlarm()\n" + err);
                });
            } else {
                // This user does not exist. Insert it in DB
                userController.createUserWithAlarm(message).catch(err => {
                    console.log("Excepción arrojada por createUserWithAlarm()\n" + err);
                });;
                message.channel.send(message.author.username + strings.SUBSCRIBED);
            }
        }).catch(err => {
            console.log("Excepción arrojada por readUser()\n" + err);
        });

    }
}