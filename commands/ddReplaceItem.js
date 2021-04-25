const { readDDHero, readUser } = require("../controllers/userController");
const { GetExtraItem, ReplaceItem } = require("../my_modules/daemonDice");
const { getModuleString } = require("../strings");

const MIN_MINUTES = 0;
const MAX_MINUTES = 59;

module.exports = {
	name: "ddReplaceItem",
	descrip: [
		"Replace an old item to make room for the last item you found on a quest.",
		"Reemplaza un item viejo para hacer lugar para el último ítem encontrado en una quest.",
	],
	hidden: false,
	execute(message) {
		// Read the arguments of the command and separate them.
		let args = message.content.split(/\s+/);

		// check if args isNaN
		if (isNaN(args[1])) {
			// notify error
			message.channel.send(getModuleString("DAEMON_DICE", "ERROR", message.guild.id).INVALID_ITEM_SLOT);
			return;
		}

		// read user
		readUser(message.member.id, message.guild.id).then((user) => {
			let slot = args[1] - 1;
			let hero = user.daemonDice.ddHero;
			// check if hero is null
			if (hero === null) {
				// no hero
				message.channel.send(message.member.displayName + getModuleString("DAEMON_DICE", "NO_HERO", message.guild.id));
				return;
			}

			// check if hero is dead
			if (hero.dead || hero.legend) {
				// hero is dead
				message.channel.send(message.member.displayName + getModuleString("DAEMON_DICE", "NO_HERO", message.guild.id));
				return;
			}
			// check if there's a 6th item waiting in line
			if (GetExtraItem(hero) === -1) {
				// no item to replace
				message.channel.send(getModuleString("DAEMON_DICE", "ERROR", message.guild.id).NO_EXTRA_ITEM);
				return;
			}
			// replace item in [slot] for the 6th item.

			let replace = ReplaceItem(hero, slot);
			if (replace.success) {
				user.daemonDice.ddHero.itemIndex = replace.payload.itemIndex;
				user.daemonDice.ddHero.itemLevel = replace.payload.itemLevel;
				user.markModified("daemonDice");
				user.save().then((updated) => {
					// notify success
					message.channel.send(message.member.displayName + getModuleString("DAEMON_DICE", "REPLACE_ITEM_SUCCESS", message.guild.id));
				});
			} else {
				// notify error
				message.channel.send(getModuleString("DAEMON_DICE", "ERROR", message.guild.id).INVALID_ITEM_SLOT);
			}
		});
	},
};
