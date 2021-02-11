const Discord = require("discord.js");
const { setFriendshipAll } = require("../controllers/userController");
const globals = require("../globals");

module.exports = {
    name: "resetfs",
    descrip: "(ADMIN) Resetea el % de amistad con Sumomo de todos los users del server.",
    hidden: false,
    execute(message) {
        // User must be an admin.
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send(message.author.username + "-sama, no tiene permisos para ejecutar ese comando.");
            return;
        }
        setFriendshipAll(globals.FS_DEFAULT_VALUE, message.guild.id);
        message.channel.send("Los % de amistad han sido reseteados al valor inicial.");
    }
}