const { getQueues, isActivated } = require("../my_modules/music");
const strings = require("../strings");

module.exports = {
	name: "skip",
	descrip: ["Skips current song.", "Saltea la canción actual."],
	hidden: false,
	execute(message) {
		if (!isActivated) return;

		// Look at the map that contains all the music queues from all servers, then look for the server with the guild id from the message.
		const serverQueue = getQueues().get(message.guild.id);

		// User is not connected to a voice channel.
		if (!message.member.voice.channel) {
			return message.channel.send(strings.getModuleString("MUSIC", "NO_VOICE_CHANNEL", message.guild.id)).catch(console.error);
		}
		// There is no songs in queue for this server.
		if (!serverQueue) {
			return message.channel.send(strings.getModuleString("MUSIC", "NO_SONGS_IN_QUEUE", message.guild.id)).catch(console.error);
		}
		// End this dispatcher to play the next song.
		try {
			serverQueue.connection.dispatcher.end();
		} catch (err) {
			console.log("Exception: skip command failed.");
		}
	},
};
