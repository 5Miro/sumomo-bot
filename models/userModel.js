const mongoose = require("mongoose");
const globals = require("../globals");

const userSchema = new mongoose.Schema({
	user_id: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	guild_id: {
		type: String,
		required: true,
	},
	mudae_alarm: {
		type: Boolean,
		default: false,
	},
	friendship: {
		type: Number,
		default: globals.FS_DEFAULT_VALUE,
		required: false,
		min: globals.FS_MIN_VALUE,
		max: globals.FS_MAX_VALUE,
	},
	fs_quota: {
		type: Number,
		default: 0,
	},
	momocoins: {
		type: Number,
		default: 0,
		min: 0,
	},
	daemonDice: {
		ddHero: {
			type: Object,
			default: null,
		},
		created_characters: {
			type: Number,
			default: 0,
		},
		game_overs: {
			type: Number,
			default: 0,
		},
		rolls_left: {
			type: Number,
			default: globals.ROLLS_PER_QUEST,
		},
		dm: {
			type: Boolean,
			default: true,
		},
	},
});

const User = mongoose.model("users", userSchema);

module.exports = User;
