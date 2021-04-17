const { readUser } = require("../controllers/userController");
const globals = require("../globals");

module.exports = {
	name: "economy",
	isActivated: true,
	descrip: ["Users gain and spend Momocoins", "Los usuarios obtienen y gastan Momocoins"],
	OnInterval() {},
	OnMessage(message) {
		// This function will be called when a message is read.
	},
	OnVoiceStateUpdate(oldState, newState) {},
};
