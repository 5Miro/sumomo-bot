const { getQueues, isActivated } = require("../my_modules/music");

module.exports = {
  name: "pause",
  descrip: "Pausa la música.",
  hidden: false,
  execute(message) {

    if (!isActivated) return;

    // Look at the map that contains all the music queues from all servers, then look for the server with the guild id from the message.
    const serverQueue = getQueues().get(message.guild.id)

    if (!message.member.voice.channel) {
      return message.channel.send("Debes estar en un canal de voz para ejecutar este comando.").catch(console.error);
    }
    if (!serverQueue) {
      return message.channel.send("No hay canciones en la cola.").catch(console.error);
    }
    // End this dispatcher to play the next song.
    if (serverQueue.playing) {
      serverQueue.playing = false;
      try {
        serverQueue.connection.dispatcher.pause(true); // StreamDispatcher object. Sends voice packet data to the voice connection
      } catch (err) {
        console.log("Exception: pausing dispatcher has failed.");
      }
      return message.channel.send("Reproducción pausada.").catch(console.error);
    }
  },
};
