const { getQueues, isActivated } = require("../my_modules/music");
const strings = require("../strings");

module.exports = {
  name: "stop",
  descrip: ["Stops the music and disconnects the bot.", "Detiene la música y desconecta al bot."],
  hidden: false,
  execute(message) {

    if (!isActivated) return;

    // Look at the map that contains all the music queues from all servers, then look for the server with the guild id from the message.
    const serverQueue = getQueues().get(message.guild.id)

    if (!message.member.voice.channel) {
      return message.channel.send(strings.getModuleString("MUSIC", "NO_VOICE_CHANNEL", message.guild.id)).catch(console.error);
    }
    if (!serverQueue) {
      return message.channel.send(strings.getModuleString("MUSIC", "NO_SONGS_IN_QUEUE", message.guild.id)).catch(console.error);
    }
    serverQueue.songs = [];
    try {
      serverQueue.connection.dispatcher.end();
    } catch (err) {
      console.log("Exception: stop command failed");
    }
  },
};
