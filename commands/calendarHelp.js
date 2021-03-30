const { getModuleString } = require("../strings");

module.exports = {
	name: "calendarHelp",
	descrip: ["Get some help for the calendar.", "Recibe ayuda con el calendario."],
	hidden: false,
	execute(message) {
		message.channel.send(getModuleString("CALENDAR", "HELP", message.guild.id));
	},
};
