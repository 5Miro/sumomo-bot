const Discord = require("discord.js");
const globals = require("../globals");
const { GetFriendship } = require("../my_modules/friendship");

module.exports = {
    name: "fs",
    descrip: "Muestra el % de amistad con Sumomo.",
    hidden: false,
    execute(message) {
        GetFriendship(message);

    }
}