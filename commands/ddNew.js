const { createDDHero } = require("../controllers/userController");
const { CreateHero } = require("../my_modules/daemonDice");

module.exports = {
	name: "ddNew",
	descrip: ["Get a new hero assign to your Daemon.", "Asigna un nuevo héroe a tu Daemon."],
	hidden: false,
	execute(message) {
		// Read the arguments of the command and separate them.
		let args = message.content.split(/\s+/);

		if (!args[1]) {
			message.channel.send("You must choose a name");
			return;
		}

		let hero = CreateHero(args[1]);
		createDDHero(message.member.id, message.guild.id, hero).then((doc) => {
			message.channel.send("Daemon " + message.member.displayName + ": a new hero named " + hero.name + " has been assigned to you.");
		});
	},
};
