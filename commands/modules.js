const Discord = require("discord.js");
const globals = require("../globals");
const strings = require("../strings");
const { getServerLanguageIndex } = require("../utils");

module.exports = {
	name: "modules",
	descrip: ["Shows modules and their status.", "Muestra los módulos y su estado."],
	hidden: false,
	execute(message) {
		const embed = new Discord.MessageEmbed()
			.setAuthor(
				strings.getSystemString("AUTHOR", message.guild.id),
				"https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
				"https://github.com/5Miro"
			)
			.setTitle("Sumomo - pocket persocom - " + process.env.VERSION)
			.setColor(globals.embed_color)
			.addFields({ name: "\u200B", value: strings.getCommandString("MODULES", "EMBED_SUBTITLE", message.guild.id) });

		// Iterate over modules objects and embed fields.
		let modules = client.modules.array();
		modules.forEach((mod) => {
			embed.addFields({
				name: "." + mod.name,
				value: mod.descrip[getServerLanguageIndex(message.guild.id)] + (mod.isActivated ? " --> (ON)" : " --> (OFF)"),
				inline: false,
			});
		});
		embed.addFields({ name: "\u200B", value: "\u200B" }).setFooter(strings.getSystemString("FOOTER", message.guild.id));

		message.channel.send(embed).catch(console.error);
	},
};
