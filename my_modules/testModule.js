const userController = require("../controllers/userController");
const globals = require("../globals");

module.exports = {
    name: "test",
    isActivated: false,
    OnInterval() {
        // This function will be called periodically.

    },
    OnMessage(message) {
        // This function will be called when a message is read.
    }
}