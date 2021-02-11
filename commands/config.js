const Discord = require("discord.js");
const globals = require("../globals");
const { readGuild } = require("../controllers/guildController");
const { getCurrentServer } = require("../utils");

module.exports = {
    name: "config",
    descrip: "Muestra la configuración del servidor.",
    hidden: false,
    execute(message) {
        readGuild(message.guild.id).then(doc => {
            const embed = new Discord.MessageEmbed()
                .setAuthor("desarrollado por Miro", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png", "https://github.com/5Miro")
                .setTitle(doc.name)
                .setDescription("Configuración del servidor.")
                .setColor(globals.embed_color)
                .addFields({ name: "\u200B", value: "**Parámetros:**" });

            // Iterate over config object and embed fields.
            Object.entries(doc.config).forEach(cfg => {
                if (cfg[0] !== "$init") {
                    embed.addFields({ name: cfg[0], value: cfg[1], inline: false });
                };
            });

            embed
                .addFields({ name: "\u200B", value: "\u200B" })
                .setFooter("¡Gracias por confiar en Sumomo!");

            message.react("❤");
            message.channel.send(embed).catch(console.error);
        }).catch(err => {
            console.log(err);
        })

    }
}