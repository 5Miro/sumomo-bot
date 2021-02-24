const userController = require("../controllers/userController");
const strings = require("../strings");

module.exports = {
	name: "toggleAlarm",
	descrip: ["User receives a DM every time Mudae's rolls or claims reset.", "El usuario recibe un DM cuando se reseteen sus rolls o claims de Mudae."],
	hidden: false,
	execute(message) {
		// Update user toggleAlarm boolean.
		userController.toggleAlarm(message.author.id, message.author.username, message.guild.id).then((doc) => {
			// Send a message according to new value.
			if (doc.mudae_alarm) {
				message.channel.send(message.author.username + strings.getString("SUBSCRIBED", message.guild.id));
			} else {
				message.channel.send(message.author.username + strings.getString("UNSUBSCRIBED", message.guild.id));
			}
		});
	},
};
