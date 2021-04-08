const globals = require("../globals");
const { getModuleString } = require("../strings");
const { createEvent, readEventFromDate, readEventBeforeDate, deleteExpiredEvents } = require("../controllers/eventController");
const Discord = require("discord.js");
const strings = require("../strings");

/**
 * CALENDAR
 * Users register events, such as birthdays or get-togethers, into the calendar.
 * If a text-channel id is provided, Sumomo will post the upcoming events on it everyday and the month's calendar.
 * Events, by default, get deleted the day after they occur.
 * For yearly events such as birthdays, the repeat flag must be added to the command.
 * Events with the "repeat" flag on will be rescheduled for the next year the day after they expire.
 * Users can adjust the time zone of the calendar so Sumomo can time the events more accurately.
 */

/**
 * COMMANDS:
 * calendarNew [repeat] dd/MM/YYYY [description]	---------- sets a new event into the calendar. Add repeat, without (), for yearly events such as birthdays.
 * calendarCheck [days]								---------- returns the events in the following (days) days
 * calendarHelp										---------- receive a syntax explanation.
 * calendarChannel [channelID]						---------- sets the text-channel id. Default is null. If left blank, will return to null and deactivate
 * calendarTimeZone [-12 to 12 only]				---------- sets time zone
 */

module.exports = {
	name: "calendar",
	isActivated: true,
	descrip: ["Users can set events, such as birthdays", "Los usuarios pueden configurar eventos, tales como cumpleaños"],
	OnInterval() {
		// On interval, show calendar and upcoming events every day. Also delete expired events and reschedule the ones with the repeat flag on.

		// First, get current time and date.
		const date = new Date();

		// Check if hour is o'clock
		if (date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0) {
			// get local copy of servers
			let guilds = global.client.servers.array();

			// Check each server to see whether is midnight (00:00) there.
			guilds.forEach((server) => {
				// if that server's local time is 00:00
				if (date.getUTCHours() + server.calendar.time_zone === 0) {
					// Get calendar channel ID of that particular server. Messages will be sent through that channel.
					let channelID = global.client.servers.get(server.guild_id).calendar.channel_id;

					// If channel ID is set, fetch channel
					if (channelID !== null) {
						global.client.channels
							.fetch(channelID)
							.then((channel) => {
								// if channel exists, send message
								channel.send(this.GetCalendar(date.getUTCMonth(), server.guild_id)); // Show this month's calendar
								this.UpcomingEvents(server.guild_id, channel, date, globals.DEFAULT_DAYS_IN_ADVANCE); // Show upcoming events
							})
							.catch((err) => {
								// Channel ID is not valid.
							});
					}

					// Get yesterday to delete/ reschedule a day old events.
					let yesterday = new Date(date);
					yesterday.setDate(yesterday.getUTCDate() - 1);

					// Delete expired events on that server, if any.
					deleteExpiredEvents(server.guild_id, yesterday);

					// Reschedule past events with the "repeat" flag on that server.
					readEventBeforeDate(server.guild_id, yesterday).then((events) => {
						// Loop through each event.
						events.forEach((e) => {
							// If repeat flag is on, reschedule event for next year.
							if (e.repeat) {
								e.date.setFullYear(e.date.getUTCFullYear() + 1); // add 1 year.
								e.markModified("date"); // mask as modified, otherwise mongoDB won't save changed date, for some reason ¬_¬
								e.save().catch((err) => {
									console.log("Could not reschedule event _id " + e._id + "\n" + err);
								});
							}
						});
					});
				}
			});
		}
	},

	OnMessage(message) {
		// This function will be called when a message is read.
	},

	OnVoiceStateUpdate(oldState, newState) {},

	NewEvent(date, description, repeat, guild_id) {
		return createEvent(date, description, repeat, guild_id);
	},

	/**
	 * Fetches upcoming events from DB and shows them through a Discord message.
	 * @param {*} guild_id
	 * @param {*} channel
	 * @param {*} fromDate
	 * @param {*} daysAdvanced
	 */
	UpcomingEvents(guild_id, channel, fromDate, daysAdvanced) {
		// Format date to erase hours, minutes and seconds: 00:00:00 only
		let formattedDate = new Date(fromDate.getUTCFullYear(), fromDate.getUTCMonth(), fromDate.getUTCDate());

		// Fetch upcoming events
		readEventFromDate(guild_id, formattedDate, daysAdvanced).then((events) => {
			const embed = new Discord.MessageEmbed()
				.setTitle(
					strings.getModuleString("CALENDAR", "TODAY_IS", guild_id) +
						strings.getModuleString("CALENDAR", "MONTHS", guild_id)[formattedDate.getUTCMonth()] +
						" " +
						formattedDate.getUTCDate()
				)
				.setDescription(strings.getModuleString("CALENDAR", "UPCOMING_EVENTS_TITLE", guild_id))
				.setColor(globals.embed_color);

			events.forEach((e) => {
				embed.addFields({
					name:
						e.date.getTime() === formattedDate.getTime()
							? getModuleString("CALENDAR", "TODAY_TEXT", guild_id) + "  "
							: "· " + getModuleString("CALENDAR", "MONTHS", guild_id)[e.date.getUTCMonth()] + " " + e.date.getUTCDate() + " ·",
					value: "---> " + e.description,
				});
			});
			channel.send(embed);
		});
	},

	/**
	 * Returns an ASCII calendar for a specific month.
	 * guild_id must be provided to get timezone
	 * @param {*} month
	 * @param {*} guild_id
	 * @returns
	 */
	GetCalendar(month, guild_id) {
		// get date from that month.
		const chosenDate = new Date(new Date().getUTCFullYear(), month, 1);

		const dayOfWeek = chosenDate.getUTCDay(); // from sunday to saturdary, 0 to 6
		const dayOfMonth = chosenDate.getUTCDate(); // from 1 to 31

		// which day of the week is the first day of this month?
		var x = dayOfWeek - ((dayOfMonth - 1) % 7); // result from 0 to 6

		// create array of ▒▒ empty space
		var array = [];
		for (let i = 0; i < 42; i++) {
			array[i] = "▒▒";
		}

		// get Ascii calendar.
		var string = getModuleString("CALENDAR", "CALENDAR_ASCII", guild_id);

		// get max days of month (30 or 31, except for february)
		const maxDays = new Date(chosenDate.getUTCFullYear(), chosenDate.getUTCMonth() + 1, 0).getUTCDate();

		// Fill the array with the days of the month.
		for (let i = 0; i < maxDays; i++) {
			let newValue = (i + 1).toString().padStart(2, "0");
			let targetValue = x.toString().padStart(2, "0");
			array[x] = newValue;
			x++;
		}

		// For each element of the array, replace the values from the Ascii string.
		array.forEach((value, i) => {
			let targetIndex = i.toString().padStart(2, "0");
			string = string.replace(targetIndex, value);
		});

		// Replace year.
		string = string.replace("year", chosenDate.getUTCFullYear());
		string = string.replace("/month      /", getModuleString("CALENDAR", "MONTHS", guild_id)[month].padEnd(13, " "));

		return "```" + string + "```";
	},
};
