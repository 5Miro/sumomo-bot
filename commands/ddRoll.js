const { readUser, spendMomocoins } = require("../controllers/userController");
const { RollD20, GetExtraRollCost } = require("../my_modules/daemonDice");
const { getModuleString } = require("../strings");

module.exports = {
	name: "ddRoll",
	descrip: ["Roll a Daemon Dice to aid your hero.", "Tira un Dado Daemon para asistir a tu héroe."],
	hidden: false,
	execute(message) {
		readUser(message.member.id, message.guild.id).then((user) => {
			// if user's hero is null
			if (user.daemonDice.ddHero === null) {
				return message.channel.send(message.member.displayName + getModuleString("DAEMON_DICE", "NO_HERO", message.guild.id));
			}

			// If user's hero is not alive or is a legend.
			if (user.daemonDice.ddHero.dead || user.daemonDice.ddHero.legend) {
				return message.channel.send(message.member.displayName + getModuleString("DAEMON_DICE", "NO_HERO", message.guild.id));
			}

			if (user.daemonDice.rolls_left > 0) {
				// If user has rolls left.

				// Check if user has enough coins
				spendMomocoins(user.user_id, user.guild_id, GetExtraRollCost(user.daemonDice.rolls_left)).then((res) => {
					if (res.success) {
						let spentString = "";
						if (res.cost !== 0) {
							spentString =
								"\n" + message.member.displayName + getModuleString("MOMOCOINS", "SPEND_COINS", message.guild.id) + res.cost + " Momocoins";
						}
						user.daemonDice.rolls_left--; // remove a roll
						user.markModified("daemonDice");
						// save modification
						user.save().then((result) => {
							// once saved succesfully, roll dice.
							let d20 = RollD20(message.member.id, message.guild.id);
							message.channel.send(
								message.member.displayName +
									getModuleString("DAEMON_DICE", "ROLLED_DICE", message.guild.id) +
									d20 +
									getModuleString("DAEMON_DICE", "DICE_LEFT", message.guild.id) +
									user.daemonDice.rolls_left +
									spentString
							);
						});
					} else {
						message.channel.send(
							message.member.displayName +
								getModuleString("MOMOCOINS", "NOT_ENOUGH_COINS", message.guild.id) +
								"\n" +
								getModuleString("DAEMON_DICE", "ROLL_COST", message.guild.id) +
								GetExtraRollCost(user.daemonDice.rolls_left)
						);
					}
				});
			} else {
				// user has no rolls left
				message.channel.send(message.member.displayName + getModuleString("DAEMON_DICE", "NO_DICE_LEFT", message.guild.id));
			}
		});
	},
};
