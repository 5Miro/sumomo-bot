const Discord = require("discord.js");
const globals = require("../globals");
const strings = require("../strings");
const { getCurrentServer, getServerLanguageIndex } = require("../utils");

module.exports = {
	name: "help",
	descrip: ["Shows info and commands.", "Muestra información y comandos."],
	hidden: false,
	execute(message) {
		const embed = new Discord.MessageEmbed()
			.setAuthor(
				strings.getSystemString("AUTHOR", message.guild.id),
				"https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
				"https://github.com/5Miro"
			)
			.setTitle("Sumomo - pocket persocom - " + process.env.VERSION)
			.setDescription(strings.getCommandString("HELP", "EMBED_DESCRIPTION", message.guild.id))
			.setColor(globals.embed_color)
			.addFields({ name: "\u200B", value: strings.getCommandString("HELP", "EMBED_SUBTITLE", message.guild.id) });

		// Iterate over command objects and embed fields.
		let commands = message.client.commands.array();
		commands.forEach((cmd) => {
			embed.addFields({
				name: getCurrentServer(message.guild.id).config.prefix + cmd.name,
				value: cmd.descrip[getServerLanguageIndex(message.guild.id)],
				inline: false,
			});
		});
		embed.addFields({ name: "\u200B", value: "\u200B" }).setFooter(strings.getSystemString("FOOTER", message.guild.id));

		message.react("❤");
		message.channel.send(embed).catch(console.error);
	},
};
