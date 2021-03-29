const mongoose = require("mongoose");
const globals = require("../globals");

const eventSchema = new mongoose.Schema(
	{
		guild_id: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		repeat: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const Event = mongoose.model("Events", eventSchema);

module.exports = Event;
