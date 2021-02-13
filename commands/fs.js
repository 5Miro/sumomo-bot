const { GetFriendship } = require("../my_modules/friendship");

module.exports = {
    name: "fs",
    descrip: ["Show Sumomo's friendship % with the user.", "Muestra el % de amistad con Sumomo del usuario."],
    hidden: false,
    execute(message) {
        // Call function from friendship module.
        GetFriendship(message);
    }
}