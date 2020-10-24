const User = require("../models/userModel");

exports.createUser = async (message) => {
    const newUser = new User( {
        user_id: message.author.id,
        username: message.author.username,
        mudae_alarm: true,
    });
    newUser.save().then(doc => {
        message.channel.send(message.author.username + "-sama se ha suscrito a la alarma. Te avisaré por MP cuando se reseteen tus rolls y claims.");
    }).catch(err => {
        message.channel.send("Ya te encuentras suscrito a la alarma.");
    });
}

exports.readUser = async (message) => {
    const user = await User.find({user_id: message.author.id}).catch(err => {
        message.channel.send("Usuario no registrado.");
    });
    return user;
}

exports.updateUser = async (message) => {
    
}

exports.deleteUser = async (message) => {
    User.findOneAndDelete({user_id: message.author.id}).then(() => {
        message.channel.send(message.author.username + "-sama ya no está suscrito a la alarma.");
    }).catch(err => {
        message.channel.send("No estás suscrito a la alarma.");
    })
}

exports.readAll = async () => {
    return await User.find();
}