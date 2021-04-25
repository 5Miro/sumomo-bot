const { readGuild } = require("../controllers/guildController");
const { getModuleString, getSystemString } = require("../strings");

const MIN_MINUTES = 0;
const MAX_MINUTES = 59;

module.exports = {
	name: "ddQuestTime",
	descrip: [
		"(ADMIN) Changes Daemon Dice minutes at which heroes go on a quest.",
		"(ADMIN) Cambia los minutos en Daemon Dice en el cual los héroes van de misión.",
	],
	hidden: false,
	execute(message) {
		// User must be an admin.
		if (!message.member.hasPermission("ADMINISTRATOR")) {
			message.channel.send(message.author.username + getSystemString("PERMISSION_ERROR", message.guild.id));
			return;
		}

		// Read the arguments of the command and separate them.
		let args = message.content.split(/\s+/);

		let minutes = args[1];

		if (isNaN(args[1])) {
			// arg is not a number
			message.channel.send(getModuleString("DAEMON_DICE", "ERROR", message.guild.id).INVALID_QUEST_TIME);
			return;
		}

		minutes = parseInt(minutes);

		if (minutes < MIN_MINUTES || minutes > MAX_MINUTES) {
			// invalid input range
			message.channel.send(getModuleString("DAEMON_DICE", "ERROR", message.guild.id).INVALID_QUEST_TIME);
			return;
		}

		// Get guild doc from DB.
		readGuild(message.guild.id)
			.then((doc) => {
				// Update info.
				doc.config.daemonDice.reset_time = minutes;
				// Save changes.
				doc.save()
					.then((updated) => {
						// Update local copy stored in the Collection.
						client.servers.set(message.guild.id, updated);
						// Let know that changes were succesful.
						message.channel.send(getModuleString("DAEMON_DICE", "QUEST_TIME", message.guild.id));
					})
					.catch((err) => {
						message.channel.send(getModuleString("DAEMON_DICE", "ERROR", message.guild.id).INVALID_QUEST_TIME);
					});
			})
			.catch((err) => {
				console.log(err);
			});
	},
};
