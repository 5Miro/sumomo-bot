const globals = require("../globals");
const Guild = require("../models/guildModel");

/**
 * Reads all guilds from the database and returns the documents.
 * @param {Discord ID of guild} _id
 */
exports.readAll = async () => {
	return await Guild.find();
};

/**
 * Reads a guild from the database with a certain guild id.
 * @param {Discord ID of guild} _id
 */
exports.readGuild = async (_guild_id) => {
	return Guild.findOne({ guild_id: _guild_id });
};

exports.findGuildAndUpdate = async (_guild_id, _update) => {
	return Guild.findOneAndUpdate({ guild_id: _guild_id }, _update, { new: true });
};

/**
 * Creates a new Guild document and saves it into the database.
 * @param {Discord ID of user} _id
 * @param {Username of user} _username
 */
exports.createGuild = async (guild) => {
	const newGuild = new Guild({
		guild_id: guild.id,
		name: guild.name,
	});
	return await newGuild.save().catch((err) => {
		console.log("No se ha podido crear el guild." + err);
	});
};

/**
 * Delete a guild from the DB.
 * @param {Discord guild id} _id
 */
exports.deleteGuild = async (_id) => {
	Guild.deleteOne({ guild_id: _id }).catch((err) => {
		console.log("deleteGuild() threw an exception: " + err);
	});
};
