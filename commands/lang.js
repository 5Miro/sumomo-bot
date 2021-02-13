const { readGuild } = require("../controllers/guildController");
const { LANG } = require("../globals");
const strings = require("../strings");
module.exports = {
    name: "lang",
    descrip: ["(ADMIN) Change Sumomo's language.", "(ADMIN) Cambia el lenguaje de Sumomo."],
    hidden: false,
    execute(message) {
        // User must be an admin.
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send(message.author.username + strings.getSystemString("PERMISSION_ERROR", message.guild.id));
            return;
        }

        // Read the arguments of the command and separate them.
        let args = message.content.split(/\s+/);

        // If inserted value does not corresponds to any language in the LANG array, then it's not a valid language.
        if (LANG.indexOf(args[1]) === -1) {
            return message.channel.send(strings.getCommandString("LANG", "ERROR", message.guild.id));
        }

        // Get Guild doc from DB.
        readGuild(message.guild.id).then(doc => {
            // Update DB with new lang.
            doc.config.language = args[1];
            // Save it.
            doc.save().then(updated => {
                // Update local Collection.
                client.servers.set(message.guild.id, updated);
                // Let know that changes were succesful.
                message.channel.send(strings.getCommandString("LANG", "SUCCESS", message.guild.id));
            });
        });
    }
}