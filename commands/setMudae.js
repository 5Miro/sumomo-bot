const { readGuild } = require("../controllers/guildController");
const strings = require("../strings");
module.exports = {
    name: "setMudae",
    descrip: ["(ADMIN) Changes Mudae's alarm time config.", "(ADMIN) Cambia el horario de la alarma de Mudae."],
    hidden: false,
    execute(message) {
        // User must be an admin.
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send(message.author.username + strings.getSystemString("PERMISSION_ERROR", message.guild.id));
            return;
        }

        // Read the arguments of the command and separate them.
        let args = message.content.split(/\s+/);

        // Get guild doc from DB.
        readGuild(message.guild.id).then(doc => {
            // Update info.
            doc.config.mudae.initial_hour = args[1];
            doc.config.mudae.initial_minutes = args[2];
            doc.config.mudae.claim_interval = args[3];
            doc.config.mudae.rolls_interval = args[4];
            // Save changes.
            doc.save().then(updated => {
                // Update local copy stored in the Collection.
                client.servers.set(message.guild.id, updated);
                // Let know that changes were succesful.
                message.channel.send(strings.getCommandString("SETMUDAE", "SUCCESS", message.guild.id));
            }).catch(err => {
                message.channel.send(strings.getCommandString("SETMUDAE", "ERROR", message.guild.id));
            });
        }).catch(err => {
            console.log(err);
        });
    }
}