const globals = require("../globals");
const userController = require("../controllers/userController");
const strings = require("../strings");

module.exports = {
    name: "mudaeAlarm",
    isActivated: true,
    descrip: "Sumomo envía DMs recordando sobre los resets de Mudae",
    OnInterval() {

        // Get current time and date.
        const date = new Date();

        let guilds = global.client.servers.array();
        guilds.forEach(guild => {
            if (date.getUTCMinutes() == guild.config.mudae.initial_minutes && date.getUTCSeconds() == 0) {  // First check MINUTES
                // Rolls reset.
                // Now check HOURS
                for (i = guild.config.mudae.initial_hour; i < globals.hours_per_day; i += guild.config.mudae.claim_interval) {
                    if (date.getUTCHours() == i) {
                        ringAlarm(strings.RESET_CLAIMS[Math.floor(Math.random() * strings.RESET_CLAIMS.length), guild.guild_id]); // get random string
                        return;
                    }
                }
                // No claims, but still rolls
                ringAlarm(strings.RESET_ROLLS[Math.floor(Math.random() * strings.RESET_ROLLS.length), guild.guild_id]); // get random string

            }
        })
    },
    OnMessage(message) {

    },
    OnVoiceStateUpdate(oldState, newState) {

    }
}

// Get users from DB and then send DM.
async function ringAlarm(string, guild_id) {
    // get users from db from a that specific server.
    const users = await userController.readAllFromGuild(guild_id);
    // For each document in user database, fetch user from id and send a DM.
    for (const doc of users) {
        if (!doc.mudae_alarm) continue; // Only send message if user has set the mudae alarm to ON
        client.users.fetch(doc.user_id).then(user => {
            user.send(doc.username + string).then(msg => {
                // Delete message after timeout.
                msg.delete({ timeout: globals.rolls_interval * 60 * 60 * 1000 }).catch(err => { // timeout is equal to rolls time interval in miliseconds.
                    console.log("No se ha podido borrar el mensaje.");
                });
            }).catch(err => {
                console.log("No se ha podido enviar el PM\n" + err);
            });
        });
    }
}