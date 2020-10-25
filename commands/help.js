const Discord = require("discord.js");
const globals = require("../globals");

module.exports = {
    name: "help",
    descrip: "Muestra información y comandos.",
    execute(message) {
        const embed = new Discord.MessageEmbed()
            .setAuthor("desarrollado por Miro", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png", "https://github.com/5Miro")
            .setTitle("Sumomo - pocket persocom - " + process.env.VERSION)
            .setDescription("Bot multipropósito; Sumomo es optimista, hiperactiva y muy kawaii.")
            .setColor(globals.embed_color)
            .addFields({ name: "\u200B", value: "**Comandos:**" });

        let commands = message.client.commands.array();
        commands.forEach(cmd => {
            embed.addFields({ name: globals.prefix + cmd.name, value: cmd.descrip, inline: false });
        });
        embed
            .addFields({ name: "\u200B", value: "\u200B" })
            .setFooter("¡Gracias por confiar en Sumomo!");

        message.react("❤");
        message.channel.send(embed).catch(console.error);
    }
}