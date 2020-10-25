const User = require("../models/userModel");

exports.readUser = async (message) => {
    const doc = await User.findOne({ user_id: message.author.id }).catch(err => {
        message.channel.send("Usuario no registrado.");
        return null;
    });
    return doc;
}

exports.readAll = async () => {
    return await User.find();
}

exports.createUserWithAlarm = async (message) => {
    const newUser = new User({
        user_id: message.author.id,
        username: message.author.username,
        mudae_alarm: true,
    });
    return await newUser.save().catch(err => {
        console.log("No se ha podido crear el usuario.");
    })
}

exports.toggleAlarm = async (id, message, value) => {
    return await User.findByIdAndUpdate(id, { $set: { mudae_alarm: !value } }, { new: true }).catch(err => {
        console.log("Usuario no registrado.");
        return null;
    });
}