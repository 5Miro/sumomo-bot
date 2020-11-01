const userController = require("./controllers/userController");
const globals = require("./globals");

module.exports = {
    name: "TEST",
    isActivated: false,
    descrip: "Módulo de prueba, no utilizar",
    OnInterval() {
        // This function will be called periodically.

    },
    OnMessage(message) {
        // This function will be called when a message is read.
    }
}