const userController = require("../controllers/userController");
const globals = require("../globals");

module.exports = {
    name: "eraseDM",
    isActivated: false,
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
                                element.delete().catch(err => { });
                            });
                        }).catch(err => { });
                    })
                });
            }
        });

    },
    OnMessage(message) {
        // This function will be called when a message is read.
    }
}