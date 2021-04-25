const { createDDHero, readDDHero } = require("../controllers/userController");
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
			// hero must have a name
			message.channel.send(getModuleString("DAEMON_DICE", "ERROR", message.guild.id).NO_NAME);
			return;
		}

		// check if user already has a hero
		readDDHero(message.member.id, message.guild.id)
			.then((hero) => {
				if (hero !== null) {
					if (!hero.dead && !hero.legend) {
						return message.channel.send(message.member.displayName + getModuleString("DAEMON_DICE", "USER_HAS_HERO", message.guild.id));
					}
				}

				// create a hero
				let newHero = CreateHero(args[1]);
				// create hero in db and send msg.
				createDDHero(message.member.id, message.guild.id, newHero).then((doc) => {
					message.channel.send(
						"Daemon " +
							message.member.displayName +
							getModuleString("DAEMON_DICE", "NEW_HERO", message.guild.id).PART_1 +
							newHero.name +
							getModuleString("DAEMON_DICE", "NEW_HERO", message.guild.id).PART_2
					);
				});
			})
			.catch((err) => {});
	},
};
