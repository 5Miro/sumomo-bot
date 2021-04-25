const { readGuild } = require("../controllers/guildController");
const { getModuleString, getSystemString } = require("../strings");
module.exports = {
	name: "ddChannel",
	descrip: ["(ADMIN) Set text-channel ID for Daemon Dice records", "(ADMIN) Configura el canal de texto donde se enviarán los records del Daemon Dice"],
	hidden: false,
	execute(message) {
		// User must be an admin.
		if (!message.member.hasPermission("ADMINISTRATOR")) {
			message.channel.send(message.author.username + getSystemString("PERMISSION_ERROR", message.guild.id));
			return;
		}

		// Read the arguments of the command and separate them.
		let args = message.content.split(/\s+/);

		// Get Guild doc from DB.
		readGuild(message.guild.id).then((doc) => {
			// Update DB with new lang.
			doc.config.daemonDice.channel_id = args[1];
			// Save it.
			doc.save().then((updated) => {
				// Update local Collection.
				client.servers.set(message.guild.id, updated);
				// Let know that changes were succesful.
				message.react("🎲").catch((err) => {});
				message.channel.send(getModuleString("DAEMON_DICE", "CHANNEL_UPDATED", message.guild.id));
			});
		});
	},
};
