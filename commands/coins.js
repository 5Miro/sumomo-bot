const { readUser } = require("../controllers/userController");
const { getModuleString } = require("../strings");

module.exports = {
	name: "coins",
	descrip: ["Shows user's Momocoin balance.", "Muestra el balance de Momocoins del usuario."],
	hidden: false,
	execute(message) {
		// get coins
		readUser(message.member.id, message.guild.id).then((user) => {
			message.channel.send(
				message.member.displayName + getModuleString("MOMOCOINS", "CURRENT_COINS", message.guild.id) + user.momocoins + " Momocoins (•ᗜ•)"
			);
		});
	},
};
