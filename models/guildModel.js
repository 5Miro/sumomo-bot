const mongoose = require("mongoose");
const globals = require("../globals");

const guildSchema = new mongoose.Schema(
	{
		guild_id: {
			type: String,
			required: true,
			unique: true,
		},
		name: {
			type: String,
			required: true,
		},
		config: {
			prefix: {
				type: String,
				default: "|", // Prefix to identify commands.
			},
			mudae: {
				initial_hour: { type: Number, default: "1" },
				initial_minutes: { type: Number, default: "0" },
				claim_interval: { type: Number, default: "3" },
				rolls_interval: { type: Number, default: "1" },
			},
			language: {
				type: String,
				default: "en",
			},
			daemonDice: {
				reset_time: { type: Number, default: 0, min: 0, max: 59 },
				channel_id: { type: String, default: null },
			},
		},
		calendar: {
			channel_id: { type: String, default: null },
			time_zone: { type: Number, default: 0 },
		},
	},
	{
		timestamps: true,
	}
);

const Guild = mongoose.model("guilds", guildSchema);

module.exports = Guild;
