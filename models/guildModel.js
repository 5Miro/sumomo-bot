const mongoose = require("mongoose");
const globals = require("../globals");

const guildSchema = new mongoose.Schema({
    guild_id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    prefix: {
        type: String,
        default: "|",
    },
    mudae: {
        prefix: { type: String, default: "$" },
        initial_hour: { type: Number, default: "1" },
        initial_minutes: { type: Number, default: "0" },
        claim_interval: { type: Number, default: "3" },
        rolls_interval: { type: Number, default: "1" },
    }
});

const Guild = mongoose.model("guilds", guildSchema);

module.exports = Guild;