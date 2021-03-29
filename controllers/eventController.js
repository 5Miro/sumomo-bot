const globals = require("../globals");
const Event = require("../models/eventModel");

/**
 * Creates a new event into the database.
 * @param {*} calendarEvent
 * @param {*} _guild_id
 * @returns
 */
exports.createEvent = async (_date, _description, _repeat, _guild_id) => {
	const newEvent = new Event({
		guild_id: _guild_id,
		date: _date,
		description: _description,
		repeat: _repeat,
	});
	return await newEvent.save().catch((err) => {
		console.log("No se ha podido crear el evento." + err);
		return null;
	});
};

/**
 * Reads an event from the database and returns the document.
 * @param {Discord ID of user} _id
 */
exports.readEvent = async (_guild_id, _date) => {
	return Event.find({ guild_id: _guild_id, date: _date }).catch((err) => {
		console.log("Event does not exist." + err);
		return null;
	});
};

/**
 * Reads all events from a server.
 * @param {Discord ID of user} _id
 */
exports.readAllEvents = async (_guild_id) => {
	return Event.find({ guild_id: _guild_id }).catch((err) => {
		console.log("Event does not exist." + err);
		return null;
	});
};

/**
 * Reads events from server, from fromDate up to toDate. toDate is calculated from daysAdvanced.
 * @param {*} _guild_id
 * @param {*} fromDate
 * @param {*} daysAdvanced
 * @returns
 */
exports.readEventFromDate = async (_guild_id, fromDate, daysAdvanced) => {
	// Create a toDate object using fromDate and daysAdvanced
	let toDate = new Date(fromDate.getUTCFullYear(), fromDate.getUTCMonth(), fromDate.getUTCDate() + daysAdvanced);

	return Event.find(
		{
			guild_id: _guild_id,
			date: { $gte: fromDate, $lte: toDate },
		},
		[],
		{ sort: { date: 1 } }
	).catch((err) => {
		console.log("Event does not exist." + err);
		return null;
	});
};
