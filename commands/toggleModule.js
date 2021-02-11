const Discord = require("discord.js");
const globals = require("../globals");
const { getCurrentServer } = require("../utils");

module.exports = {
    name: "toggleModule",
    descrip: "(OWNER) Activa o desactiva módulos de función.",
    hidden: true,
    execute(message) {
        // User must be an admin.
        if (!message.member.id === process.env.MASTER_ID) {
            message.channel.send(message.author.username + "-sama, no tiene permisos para ejecutar ese comando.");
            return;
        }

        // Read the arguments of the command and separate them.
        let args = message.content.substring(getCurrentServer(message.guild.id).config.prefix.length).split(/\s+/);

        // Get module from map and change the activation state.
        if (global.client.modules.get(args[1])) {
            mod = global.client.modules.get(args[1]);
            mod.isActivated = !mod.isActivated;
            message.channel.send("LOG: módulo " + mod.name + " ; isActivated = " + mod.isActivated);
        }
    }
}