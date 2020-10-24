const mongoose = require("mongoose");
const userController = require("../controllers/userController");

module.exports = {
    name: "unsub",
    execute(message) {
        userController.deleteUser(message);
    }
}