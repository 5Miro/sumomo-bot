const Discord = require("discord.js");
const globals = require("../globals");

module.exports = {
    name: "toggleModule",
    descrip: "(ADMIN) Activa o desactiva módulos de función.",
    hidden: false,
    execute(message) {
        // User must be an admin.
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send(message.author.username + "-sama, no tiene permisos para ejecutar ese comando.");
            return;
        }

        // Read the arguments of the command and separate them.
        let args = message.content.substring(globals.prefix.length).split(/\s+/);

        // Get module from map and change the activation state.
        if (global.client.modules.get(args[1])) {
            mod = global.client.modules.get(args[1]);
            mod.isActivated = !mod.isActivated;
            message.channel.send("LOG: módulo " + mod.name + " ; isActivated = " + mod.isActivated);
        }
    }
}