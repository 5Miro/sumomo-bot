const { createDDHero } = require("../controllers/userController");
const { CreateHero } = require("../my_modules/daemonDice");
const { getModuleString } = require("../strings");

module.exports = {
	name: "ddNew",
	descrip: ["Get a new hero assign to your Daemon.", "Asigna un nuevo héroe a tu Daemon."],
	hidden: false,
	execute(message) {
		// Read the arguments of the command and separate them.
		let args = message.content.split(/\s+/);

		if (!args[1]) {
			message.channel.send(getModuleString("DAEMON_DICE", "ERROR", message.guild.id).NO_NAME);
			return;
		}

		let hero = CreateHero(args[1]);
		createDDHero(message.member.id, message.guild.id, hero).then((doc) => {
			message.channel.send(
				"Daemon " +
					message.member.displayName +
					getModuleString("DAEMON_DICE", "NEW_HERO", message.guild.id).PART_1 +
					hero.name +
					getModuleString("DAEMON_DICE", "NEW_HERO", message.guild.id).PART_2
			);
		});
	},
};
