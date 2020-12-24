const userController = require("../controllers/userController");
const globals = require("../globals");

module.exports = {
    name: "killingGame",
    isActivated: false,
    descrip: "Upupupupu!",
    OnInterval() {


    },
    OnMessage(message) {
        // This function will be called when a message is read.
        // If a message starts with the prefix
        if (message.content.startsWith(globals.prefix) || message.content.startsWith(globals.MUDAE_PREFIX)) return;

        // If user is bot, return
        if (message.author.bot) return;
        if (message.content == "Van a jugar a matarse entre ustedes para siempre upupupu") {
            message.channel.send("<@&789204355630497833> chicos, tienen que desactivar el módulo killingGame para terminar el juego. Le regresaré temporalmente el Admin a PotatoGirl para que lo haga, pero deben apurarse (◡_◡) . Usen |help si necesitan mi ayuda.")
        }

    },
    OnVoiceStateUpdate(oldState, newState) {

    }
} 