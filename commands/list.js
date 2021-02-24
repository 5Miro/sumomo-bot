const Discord = require("discord.js");
const globals = require("../globals");
const { getQueues, isActivated } = require("../my_modules/music");
const strings = require("../strings");

module.exports = {
	name: "list",
	descrip: ["Shows songs in queue.", "Muestra las canciones en cola."],
	hidden: false,
	async execute(message) {
		if (!isActivated) return;

		// Look at the map that contains all the music queues from all servers, then look for the server with the guild id from the message.
		const serverQueue = getQueues().get(message.guild.id);

		// If there's no queue associated with this server.
		if (!serverQueue) return message.channel.send(strings.getModuleString("MUSIC", "QUEUE_LENGTH_EXCESS", message.guild.id)).catch(console.error);

		// Show loading message.
		const firstEmbed = new Discord.MessageEmbed();
		firstEmbed.setTitle(strings.getModuleString("MUSIC", "LOADING_QUEUE", message.guild.id)).setColor(globals.embed_color);

		// Store embed to edit it later when results arrive.
		var temp = await message.channel.send(firstEmbed).catch(console.error);

		// Create a new embed to edit the previous one.
		const embed = new Discord.MessageEmbed();
		embed.setTitle(serverQueue.songs.length + strings.getModuleString("MUSIC", "QUEUE_LENGTH", message.guild.id)).setColor(globals.embed_color);

		// Add a field to the embed. One field per song up to LIST_MAX_LENGTH
		serverQueue.songs.forEach((song, i) => {
			if (i < globals.LIST_MAX_LENGTH) {
				if (i == 0) {
					embed.addField(i + 1 + strings.getModuleString("MUSIC", "PLAYING_NOW", message.guild.id), song.title);
				} else {
					embed.addField(i + 1 + "- ", song.title);
				}
			}
		});

		if (serverQueue.songs.length > globals.LIST_MAX_LENGTH) {
			embed.addField("...", strings.getModuleString("MUSIC", "QUEUE_LENGTH_EXCESS", message.guild.id));
		}
		message.react("👍");
		// Edit the previous embed and return.
		return temp.edit(embed);
	},
};
