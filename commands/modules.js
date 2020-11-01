const Discord = require("discord.js");
const globals = require("../globals");

module.exports = {
    name: "modules",
    descrip: "Muestra los módulos y su estado.",
    hidden: false,
    execute(message) {

        const embed = new Discord.MessageEmbed()
            .setAuthor("desarrollado por Miro", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png", "https://github.com/5Miro")
            .setTitle("Sumomo - pocket persocom - " + process.env.VERSION)
            .setColor(globals.embed_color)
            .addFields({ name: "\u200B", value: "**Módulos:**" });


        let modules = client.modules.array();
        modules.forEach(mod => {
            embed.addFields({ name: "." + mod.name, value: mod.descrip + (mod.isActivated ? " --> (ACTIVADO)" : " --> (DESACTIVADO)"), inline: false });
        });
        embed
            .addFields({ name: "\u200B", value: "\u200B" })
            .setFooter("¡Gracias por confiar en Sumomo!");

        message.channel.send(embed).catch(console.error);
    }
}