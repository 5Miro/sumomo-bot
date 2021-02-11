const Discord = require("discord.js");
const { findGuildAndUpdate, readGuild } = require("../controllers/guildController");
module.exports = {
    name: "setPrefix",
    descrip: "Cambia el prefijo para comandos de Sumomo.",
    hidden: false,
    execute(message) {
        // User must be an admin.
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send(message.author.username + "-sama, no tiene permisos para ejecutar ese comando.");
            return;
        }

        // Read the arguments of the command and separate them.
        let args = message.content.split(/\s+/);

        // Update in DB and also update the local servers Collection.
        readGuild(message.guild.id).then(doc => {
            doc.config.prefix = args[1];
            doc.save().then(updated => {
                client.servers.set(message.guild.id, updated);
            });
        });

        // Let know that changes were succesful.
        message.channel.send("El prefijo ha sido cambiado a: " + args[1]);

    }
}