const { readUser } = require("../controllers/userController");
const { getModuleString } = require("../strings");

module.exports = {
	name: "ddToggleDM",
	descrip: ["Toggles Daemon Dice DMs", "Activa/desactiva los DMs de Daemon Dice"],
	hidden: false,
	execute(message) {
		// get player from DB
		readUser(message.member.id, message.guild.id).then((user) => {
			user.daemonDice.dm = !user.daemonDice.dm;
			user.save().then((res) => {
				if (res.daemonDice.dm) {
					message.channel.send(message.member.displayName + getModuleString("DAEMON_DICE", "DM_TOGGLE_ON", message.guild.id));
				} else {
					message.channel.send(message.member.displayName + getModuleString("DAEMON_DICE", "DM_TOGGLE_OFF", message.guild.id));
				}
			});
		});
	},
};
