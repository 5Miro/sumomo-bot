const Discord = require("discord.js");
const globals = require("../globals");
const { readGuild } = require("../controllers/guildController");
const strings = require("../strings");

module.exports = {
	name: "config",
	descrip: ["Show server's configuration.", "Muestra la configuración del servidor."],
	hidden: false,
	execute(message) {
		readGuild(message.guild.id)
			.then((doc) => {
				const embed = new Discord.MessageEmbed()
					.setAuthor(
						strings.getSystemString("AUTHOR", message.guild.id),
						"https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
						"https://github.com/5Miro"
					)
					.setTitle(doc.name)
					.setDescription(strings.getCommandString("CONFIG", "EMBED_DESCRIPTION", message.guild.id))
					.setColor(globals.embed_color)
					.addFields({ name: "\u200B", value: strings.getCommandString("CONFIG", "EMBED_SUBTITLE", message.guild.id) });

				// Iterate over config object and embed fields.
				Object.entries(doc.config).forEach((cfg) => {
					if (cfg[0] !== "$init") {
						embed.addFields({ name: cfg[0], value: cfg[1], inline: false });
					}
				});

				embed.addFields({ name: "\u200B", value: "\u200B" }).setFooter(strings.getSystemString("FOOTER", message.guild.id));

				message.react("❤").catch((err) => {});
				message.channel.send(embed).catch(console.error);
			})
			.catch((err) => {
				console.log(err);
			});
	},
};
