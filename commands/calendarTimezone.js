const { readGuild } = require("../controllers/guildController");
const { getModuleString } = require("../strings");

const VALID_TIMEZONE_INTERVAL = [-12, 12];

module.exports = {
	name: "calendarTimezone",
	descrip: ["(ADMIN) Set this server's timezone for the calendar.", "(ADMIN) Configura la zona horaria del servidor para el calendario."],
	hidden: false,
	execute(message) {
		// User must be an admin.
		if (!message.member.hasPermission("ADMINISTRATOR")) {
			message.channel.send(message.author.username + strings.getSystemString("PERMISSION_ERROR", message.guild.id));
			return;
		}

		// Read the arguments of the command and separate them.
		let args = message.content.split(/\s+/);

		// Check if arg is a number
		if (isNaN(args[1])) {
			message.channel.send(getModuleString("CALENDAR", "ERROR", message.guild.id).TIME_ZONE_ERROR);
		}

		// parse into integer, if float.
		args[1] = parseInt(args[1]);

		// Check if arg is between valid timezone interval.
		if (args[1] < VALID_TIMEZONE_INTERVAL[0] && args[1] > VALID_TIMEZONE_INTERVAL[1]) {
			// timezone is not valid.
			message.channel.send(getModuleString("CALENDAR", "ERROR", message.guild.id).TIME_ZONE_ERROR);
		}

		// Get Guild doc from DB.
		readGuild(message.guild.id).then((doc) => {
			// Update DB with new lang.
			doc.calendar.time_zone = args[1];
			// Save it.
			doc.save().then((updated) => {
				// Update local Collection.
				client.servers.set(message.guild.id, updated);
				// Let know that changes were succesful.
				message.channel.send(getModuleString("CALENDAR", "TIME_ZONE_SET", message.guild.id));
			});
		});
	},
};
