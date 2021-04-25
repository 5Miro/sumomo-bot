const { getModuleString } = require("../strings");

module.exports = {
	name: "ddHelp",
	descrip: ["Get help with Daemon Dice.", "Recibe ayuda sobre Daemon Dice."],
	hidden: false,
	execute(message) {
		global.client.users.fetch(message.member.id).then((user) => {
			user.send("```" + getModuleString("DAEMON_DICE", "HELP_1", message.guild.id) + "```");
			user.send("```" + getModuleString("DAEMON_DICE", "HELP_2", message.guild.id) + "```");
		});
	},
};
