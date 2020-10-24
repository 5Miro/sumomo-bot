const mongoose = require("mongoose");
const userController = require("../controllers/userController");

module.exports = {
    name: "sub",
    execute(message) {
        userController.createUser(message);
    }    
}