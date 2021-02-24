const { readGuild } = require("../controllers/guildController");
const globals = require("../globals");
const strings = require("../strings");
module.exports = {
	name: "setPrefix",
	descrip: ["(ADMIN) Changes Sumomo's command prefix.", "(ADMIN) Cambia el prefijo para comandos de Sumomo."],
	hidden: false,
	execute(message) {
		// User must be an admin.
		if (!message.member.hasPermission("ADMINISTRATOR")) {
			message.channel.send(message.author.username + strings.getSystemString("PERMISSION_ERROR", message.guild.id));
			return;
		}

		// Read the arguments of the command and separate them.
		let args = message.content.split(/\s+/);

		// Check if new prefix length is valid.
		if (args[1] === undefined) {
			return message.channel.send(strings.getCommandString("SETPREFIX", "ERROR", message.guild.id));
		}
		if (args[1].length < globals.PREFIX_MIN_LENGTH || args[1].length > globals.PREFIX_MAX_LENGTH) {
			return message.channel.send(strings.getCommandString("SETPREFIX", "ERROR", message.guild.id));
		}

		// Get guild doc from DB.
		readGuild(message.guild.id).then((doc) => {
			// Update info..
			doc.config.prefix = args[1];
			// Save changes.
			doc.save()
				.then((updated) => {
					// Update local copy of server info.
					client.servers.set(message.guild.id, updated);
					// Let know that changes were succesful.
					message.channel.send(strings.getCommandString("SETPREFIX", "SUCCESS", message.guild.id));
				})
				.catch((err) => {
					message.channel.send(strings.getCommandString("SETPREFIX", "ERROR", message.guild.id));
				});
		});
	},
};
