const { getQueues, isActivated } = require("../my_modules/music");

module.exports = {
  name: "skip",
  descrip: "Saltea la canción actual.",
  hidden: false,
  execute(message) {

    if (!isActivated) return;

    // Look at the map that contains all the music queues from all servers, then look for the server with the guild id from the message.
    const serverQueue = getQueues().get(message.guild.id)

    if (!message.member.voice.channel) {
      return message.channel.send("Debes estar en un canal de voz para detener la música.").catch(console.error);
    }
    if (!serverQueue) {
      return message.channel.send("La cola de reproducción está vacía. No hay canciones para saltear.").catch(console.error);
    }
    // End this dispatcher to play the next song.
    try {
      serverQueue.connection.dispatcher.end();
    } catch (err) {
      console.log("Exception: skip command failed.");
    }
  },
};
