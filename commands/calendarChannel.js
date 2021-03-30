const { readGuild } = require("../controllers/guildController");
const { getModuleString } = require("../strings");
module.exports = {
	name: "calendarChannel",
	descrip: [
		"(ADMIN) Set text-channel ID for calendar daily reminders.",
		"(ADMIN) configura el ID del canal de texto donde se enviarán los recordatorios del calendario.",
	],
	hidden: false,
	execute(message) {
		// User must be an admin.
		if (!message.member.hasPermission("ADMINISTRATOR")) {
			message.channel.send(message.author.username + strings.getSystemString("PERMISSION_ERROR", message.guild.id));
			return;
		}

		// Read the arguments of the command and separate them.
		let args = message.content.split(/\s+/);

		// Get Guild doc from DB.
		readGuild(message.guild.id).then((doc) => {
			// Update DB with new lang.
			doc.calendar.channel_id = args[1];
			// Save it.
			doc.save().then((updated) => {
				// Update local Collection.
				client.servers.set(message.guild.id, updated);
				// Let know that changes were succesful.
				message.channel.send(getModuleString("CALENDAR", "CHANNEL_ID_SET", message.guild.id));
			});
		});
	},
};
