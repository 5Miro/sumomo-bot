const Discord = require("discord.js");
const { readGuild } = require("../controllers/guildController");
module.exports = {
    name: "setMudae",
    descrip: "Cambia la configuración de la alarma de Mudae.",
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
            doc.config.mudae.initial_hour = args[1];
            doc.config.mudae.initial_minutes = args[2];
            doc.config.mudae.claim_interval = args[3];
            doc.config.mudae.rolls_interval = args[4];
            doc.save().then(updated => {
                client.servers.set(message.guild.id, updated);
                // Let know that changes were succesful.
                message.channel.send("Éxito: la configuración de la alarma de Mudae ha sido actualizada.");
            }).catch(err => {
                message.channel.send("Error. La sintaxis o los valores son inválidos.");
            });
        }).catch(err => {
            console.log(err);
        });
    }
}