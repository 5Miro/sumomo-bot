const userController = require("../controllers/userController");
const globals = require("../globals");

module.exports = {
    name: "cleaning",
    isActivated: false,
    descrip: [
        "Cleans up Sumomo's old DMs that were not erased",
        "Limpia los DMs de Sumomo que no se borraron"
    ],
    OnInterval() {
        // This function will be called periodically.
        userController.readAll().then(users => {
            for (const doc of users) {
                if (!doc.mudae_alarm) continue;
                client.users.fetch(doc.user_id).then(user => {
                    user.createDM().then(dm => {
                        dm.messages.fetch({ limit: 50 }).then(msgs => {
                            console.log(user.username + " quedan " + msgs.array().length);
                            msgs.array().forEach(element => {
                                if (element.author.id == global.client.user.id) element.delete().catch(err => { });
                            });
                        }).catch(err => { });
                        console.log("-----------------------------------------------------");
                    })
                });
            }
        });

    },
    OnMessage(message) {
        // This function will be called when a message is read.
    },
    OnVoiceStateUpdate(oldState, newState) {

    }
}