const globals = require("../globals");

module.exports = {
    name: "mudaeAlarm",
    isActivated: true,
    OnInterval() {
        //////////////////////////////
        // MUDAE ALARM
        //////////////////////////////
        // Get current time and date.
        const date = new Date();
        if (date.getUTCMinutes() == globals.initial_minutes) {  // First check MINUTES
            // Rolls reset.
            // Now check HOURS
            for (i = globals.initial_hour; i < globals.hours_per_day; i += globals.claim_interval) {
                if (date.getUTCHours() == i) {
                    ringAlarm(strings.RESET_CLAIMS[Math.floor(Math.random() * strings.RESET_CLAIMS.length)]); // get random string
                    return;
                }
            }
            // No claims, but still rolls
            ringAlarm(strings.RESET_ROLLS[Math.floor(Math.random() * strings.RESET_ROLLS.length)]); // get random string
        }
        //////////////////////////////
        //////////////////////////////
    },
    OnMessage(message) {

    }
}

// Get users from DB and then send DM.
async function ringAlarm(string) {
    // get users from db.
    const users = await userController.readAll();
    // For each document in user database, fetch user from id and send a DM.
    for (const doc of users) {
        if (!doc.mudae_alarm) continue;
        client.users.fetch(doc.user_id).then(user => {
            user.send(doc.username + string).catch(err => {
                console.log("No se ha podido enviar el PM\n" + err);
            });
        });
    }
}