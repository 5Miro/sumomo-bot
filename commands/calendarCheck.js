const globals = require("../globals");
const { UpcomingEvents } = require("../my_modules/calendar");
const strings = require("../strings");

module.exports = {
	name: "calendarCheck",
	descrip: ["Check upcoming events in the calendar.", "Revisa los eventos venideros en el calendario."],
	hidden: false,
	execute(message) {
		// Read the arguments of the command and separate them.
		let args = message.content.split(/\s+/);

		let days;
		// If input is NaN, then days in advance to check events is by default DEFAULT_DAYS_IN_ADVANCE.
		!isNaN(args[1]) ? (days = parseInt(args[1])) : (days = globals.DEFAULT_DAYS_IN_ADVANCE);

		let date = new Date();

		UpcomingEvents(message.guild.id, message.channel, new Date(), days);
	},
};
