const userController = require("../controllers/userController");
const globals = require("../globals");
const { getGif } = require("../strings");
const strings = require("../strings");
const { getCurrentServer } = require("../utils");

/**
 * How does friendship work? Well, similar to Pokemon games.
 * Min value: 0
 * Max value: 255
 * base value: 70
 * Gain or lose points depending on user's activity.
 */

const POSITIVE_KEY_WORDS = [
	"sumomo",
	"gracias",
	"de nada",
	"buen dia",
	"buenos dias",
	"hola",
	"buenas noches",
	"te quiero",
	"thanks",
	"thank you",
	"hi",
	"hello",
	"good night",
	"good morning",
	"love",
	"you're welcome",
	"np",
];
const DEFAULT_GAIN = 1;
const BONUS_GAIN = 3;
const JOIN_VOICE_GAIN = 6;
const LOSS_PER_INTERVAL = -1;
const INTERVAL_HOURS = 3;
const INITIAL_HOUR = 1;
const THRESHOLDS = [-1, 50, 100, 150, 200, 240, 255];
const ON_CONNECTION_GREET_INDEX_TH = 3;

module.exports = {
	name: "friendship",
	isActivated: true,
	descrip: ["Users gain or lose friendship points with Sumomo", "Usuarios ganan o pierden puntos de amistad de Sumomo"],
	OnInterval() {
		// This function will be called periodically.

		// Get current time and date.
		const date = new Date();
		if (date.getUTCMinutes() == 0 && date.getUTCSeconds() == 0) {
			// First check MINUTES
			// Now check HOURS
			for (i = INITIAL_HOUR; i < globals.hours_per_day; i += INTERVAL_HOURS) {
				if (date.getUTCHours() == i) {
					userController.updateFriendshipAll(LOSS_PER_INTERVAL, true);
					return;
				}
			}
		}
	},
	OnMessage(message) {
		// This function will be called when a message is read.

		// If user is bot or system, return
		if (message.author.bot || message.system) return;

		// If message comes from a guild that hasn't been registered yet.
		try {
			if (getCurrentServer(message.guild.id) === undefined) return;
		} catch (err) {
			console.error("Exception in friendship module:\n" + err);
			return;
		}

		// If a message starts with the prefix
		if (message.content.startsWith(getCurrentServer(message.guild.id).config.prefix)) return;

		// By default
		var modifier = DEFAULT_GAIN;

		// If there's at least 1 positive key word.
		if (POSITIVE_KEY_WORDS.some((word) => message.content.toLowerCase().includes(word.toLowerCase()))) {
			modifier = BONUS_GAIN;
			message.react("❤");
		}
		userController.updateFriendship(message.author.id, message.author.username, message.guild.id, modifier);
	},

	OnVoiceStateUpdate(oldState, newState) {
		// if user just connected from a voice channel.
		if (oldState.channel === null && newState.channel !== null) {
			// If FS is above a certain threshold, say hello to user. Only say hello if you can gain points, to avoid spam.
			userController.readUser(newState.member.user.id, newState.guild.id).then((doc) => {
				if (!doc) return;
				if (doc.friendship > THRESHOLDS[ON_CONNECTION_GREET_INDEX_TH]) {
					client.users
						.fetch(doc.user_id)
						.then((user) => {
							user.send(doc.username + strings.getRandomString("HELLO", newState.guild.id))
								.then((msg) => {
									// Delete message after timeout.
									msg.delete({ timeout: 60 * 1000 }).catch((err) => {
										console.error("No se ha podido borrar el mensaje.");
									});
								})
								.catch((err) => {
									console.error("No se ha podido enviar el PM de friendship\n" + err);
								});
						})
						.catch((err) => {
							console.error("Friendship exception when fetching user from ID.\n" + err);
						});
				}
			});

			// Gain friendship points.
			userController.updateFriendship(newState.member.user.id, newState.member.user.username, newState.guild.id, JOIN_VOICE_GAIN);
		}
	},

	GetFriendship(message) {
		userController.readUser(message.author.id, message.guild.id).then((user) => {
			if (user) {
				for (let i = 0; i < THRESHOLDS.length - 1; i++) {
					if (user.friendship > THRESHOLDS[i] && user.friendship <= THRESHOLDS[i + 1]) {
						message.channel.send(
							strings.getModuleString("FRIENDSHIP", "MESSAGE_HEADER", message.guild.id) +
								Math.round((user.friendship / globals.FS_MAX_VALUE) * 100) +
								"%. " +
								strings.getString("FRIENDSHIP", message.guild.id, i)
						);
						message.channel.send(getGif("FRIENDSHIP", i));
					}
				}
			} else {
				userController.createUser(message.author.id, message.author.username, message.guild.id).then((newUser) => {
					for (let i = 0; i < THRESHOLDS.length - 1; i++) {
						if (newUser.friendship > THRESHOLDS[i] && newUser.friendship <= THRESHOLDS[i + 1]) {
							message.channel.send(
								strings.getModuleString("FRIENDSHIP", "MESSAGE_HEADER", message.guild.id) +
									Math.round((newUser.friendship / globals.FS_MAX_VALUE) * 100) +
									"%. " +
									strings.getString("FRIENDSHIP", message.guild.id, i)
							);
							message.channel.send(getGif("FRIENDSHIP", i));
						}
					}
				});
			}
		});
	},
};
