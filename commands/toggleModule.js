const strings = require("../strings");
const { getCurrentServer } = require("../utils");

module.exports = {
	name: "toggleModule",
	descrip: ["(MIRO) Turns modules ON/OFF", "(MIRO) Activa o desactiva módulos de función."],
	hidden: true,
	execute(message) {
		// User must be an admin.
		if (!message.member.id === process.env.MASTER_ID) {
			message.channel.send(message.author.username + strings.getSystemString("PERMISSION_ERROR", message.guild.id));
			return;
		}

		// Read the arguments of the command and separate them.
		let args = message.content.substring(getCurrentServer(message.guild.id).config.prefix.length).split(/\s+/);

		// Get module from map and change the activation state.
		if (global.client.modules.get(args[1])) {
			mod = global.client.modules.get(args[1]);
			mod.isActivated = !mod.isActivated;
			message.channel.send("LOG: " + mod.name + " ; isActivated = " + mod.isActivated);
		}
	},
};
