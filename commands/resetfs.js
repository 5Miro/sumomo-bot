const { setFriendshipAll } = require("../controllers/userController");
const globals = require("../globals");
const strings = require("../strings");

module.exports = {
	name: "resetfs",
	descrip: ["(ADMIN) Resets frienship % for all users in the server.", "(ADMIN) Resetea el % de amistad con Sumomo de todos los users del server."],
	hidden: false,
	execute(message) {
		// User must be an admin.
		if (!message.member.hasPermission("ADMINISTRATOR")) {
			message.channel.send(message.author.username + strings.getSystemString("PERMISSION_ERROR", message.guild.id));
			return;
		}

		// Call function from userController to reset everyones friendship from a certain guild/server.
		setFriendshipAll(globals.FS_DEFAULT_VALUE, message.guild.id).catch((err) => {
			console.log(err);
			message.channel.send(strings.getCommandString("RESETFS", "ERROR", message.guild.id));
		});
		message.channel.send(strings.getCommandString("RESETFS", "SUCCESS", message.guild.id));
	},
};
