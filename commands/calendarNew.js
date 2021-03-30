const { NewEvent } = require("../my_modules/calendar");
const { getModuleString } = require("../strings");
const strings = require("../strings");
const { getCurrentServer } = require("../utils");

const DAYS_INTERVAL = [1, 31];
const MONTHS_INTERVAL = [1, 12];

module.exports = {
	name: "calendarNew",
	descrip: ["Add an event to the calendar.", "Agrega un evento al calendario."],
	hidden: false,
	execute(message) {
		// Read the arguments of the command and separate them.
		let args = message.content.substring(getCurrentServer(message.guild.id).config.prefix.length).split(/\s+/);

		// Initialize repeat as true.
		let repeat = true;
		// Check if first argument is repeat
		if (args[1] !== "repeat") {
			// If not, add a dummy entry on the array so the date is on the second argument
			repeat = false;
			args.splice(1, 0, false);
		}
		// Parse date
		let input = args[2].split(/\//);

		// Get current date and format it to be at 00:00:00
		const currentDate = new Date(); // get current date
		const formatedCurrentDate = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate());

		/***
		 * VALIDATE DATE
		 */
		// Check if input date is dd/mm . Then add current year by default.
		if (input.length === 2) {
			input[2] = formatedCurrentDate.getUTCFullYear();
		}

		// If array length is different than 3, then syntax error.
		if (input.length !== 3) {
			// invalid date. Format is dd/mm/YYYY
			message.channel.send(getModuleString("CALENDAR", "ERROR", message.guild.id).NEW_SYNTAX_ERROR);
			return;
		}

		// Check if input date is not a number.
		input.forEach((item) => {
			if (isNaN(item)) {
				// invalid date. Input is not a number.
				message.channel.send(getModuleString("CALENDAR", "ERROR", message.guild.id).NEW_SYNTAX_ERROR);
				return;
			}
		});

		// Check if day number is valid.
		if (input[0] < DAYS_INTERVAL[0] || input[0] > DAYS_INTERVAL[1]) {
			// invalid date. Days are from 1 to 31
			message.channel.send(getModuleString("CALENDAR", "ERROR", message.guild.id).NEW_SYNTAX_ERROR);
			return;
		}
		// Check if month value is valid.
		if (input[1] < MONTHS_INTERVAL[0] || input[1] > MONTHS_INTERVAL[1]) {
			// invalid date. Months are from 1 to 12
			message.channel.send(getModuleString("CALENDAR", "ERROR", message.guild.id).NEW_SYNTAX_ERROR);
			return;
		}

		const inputDate = new Date(input[2], input[1] - 1, input[0]); // create a date object. JS counts months from 0 to 11

		// Check if date is older than current date.
		if (inputDate < formatedCurrentDate) {
			// invalid date. Input date is older than current date.
			message.channel.send(getModuleString("CALENDAR", "ERROR", message.guild.id).NEW_OLD_DATE_ERROR);
			return;
		}

		/**
		 * Get description
		 */
		let description = [...args];
		description.splice(0, 3); // remove commands name and date args. The rest of the input is considered the description.

		/**
		 * Create an event object
		 */
		NewEvent(inputDate, description.join(" "), repeat, message.guild.id).then((doc) => {
			if (doc) {
				message.channel.send(getModuleString("CALENDAR", "EVENT_ADDED_SUCCESS", message.guild.id));
			}
		});
	},
};
