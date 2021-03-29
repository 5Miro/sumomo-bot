const guildController = require("../controllers/guildController");
const globals = require("../globals");
var CryptoJS = require("crypto-js");
const { getModuleString } = require("../strings");
const { createEvent, readEventFromDate } = require("../controllers/eventController");
const { create } = require("../models/guildModel");
const Discord = require("discord.js");
const strings = require("../strings");

/**
 * CALENDAR
 * Users register events, such as birthdays, into the calendar. If a text-channel id is provided, Sumomo will post the upcoming events on it everyday.
 * Events, by default, get deleted the day after they occur. For yearly events such as birthdays, the repeat flag must be set to true.
 */

/**
 * COMMANDS:
 * calendarNew (repeat) dd/MM/YY description		---------- sets a new event into the calendar. Add repeat, without (), for yearly events such as birthdays.
 * calendarCheck (days)								---------- returns the events in the following (days) days
 * calendarDelete eventID							---------- deletes event from ID
 * calendarChannel channelID						---------- sets the text-channel id. Default is null. If left blank, will return to null and deactivate
 * calendarTimeZone (-12 to 14)						---------- sets time zone
 */

module.exports = {
	name: "calendar",
	isActivated: true,
	descrip: ["Users can set birthdays and events", "Los usuarios pueden configurar cumpleaños o eventos"],
	OnInterval() {
		// On interval, show calendar and upcoming events every day.

		// Get current time and date.
		const date = new Date();

		// check every server's timezone for calendar update.
		// Check if hour is o'clock
		if (date.getUTCMinutes() === 49 && date.getUTCSeconds() === 0) {
			let guilds = global.client.servers.array();
			guilds.forEach((server) => {
				// if that server's time is 00:00
				if (date.getUTCHours() + server.calendar.time_zone === 0) {
					// fetch calendar channel
					let channelID = global.client.servers.get(server.guild_id).calendar.channel_id;
					if (channelID === null) {
						console.log("calendar channel id has not been set.");
					} else {
						// if calendar channel is set, fetch channel
						global.client.channels
							.fetch(channelID)
							.then((channel) => {
								// if channel exists, send calendar
								channel.send(this.GetCalendar(date.getUTCMonth(), server.guild_id));
								this.UpcomingEvents(server.guild_id, channel, date, globals.DEFAULT_DAYS_IN_ADVANCE);
							})
							.catch((err) => {
								console.log("calendar module threw an exception \n" + err);
							});
					}
				}
			});
		}
	},
	OnMessage(message) {
		// This function will be called when a message is read.
		// calendar new
		// calendar check
		// calendar delete
		// calendar setChannel
		// calendar setTimeZone
	},
	OnVoiceStateUpdate(oldState, newState) {},
	NewEvent(date, description, repeat, guild_id) {
		return createEvent(date, description, repeat, guild_id);
	},
	UpcomingEvents(guild_id, channel, fromDate, daysAdvanced) {
		// now fetch upcoming events
		readEventFromDate(guild_id, fromDate, daysAdvanced).then((events) => {
			const embed = new Discord.MessageEmbed()
				.setTitle(
					strings.getModuleString("CALENDAR", "TODAY_IS", guild_id) +
						strings.getModuleString("CALENDAR", "MONTHS", guild_id)[fromDate.getUTCMonth()] +
						" " +
						fromDate.getUTCDate()
				)
				.setDescription(strings.getModuleString("CALENDAR", "UPCOMING_EVENTS_TITLE", guild_id))
				.setColor(globals.embed_color);

			let today = new Date();
			let formattedToday = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

			events.forEach((e) => {
				embed.addFields({
					name:
						e.date.getTime() === formattedToday.getTime()
							? getModuleString("CALENDAR", "TODAY_TEXT", guild_id) + "  "
							: "· " + getModuleString("CALENDAR", "MONTHS", guild_id)[e.date.getUTCMonth()] + " " + e.date.getUTCDate() + " ·",
					value: "---> " + e.description,
				});
			});
			channel.send(embed);
		});
	},
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
