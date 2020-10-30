const globals = require("../globals");
const User = require("../models/userModel");

exports.readUser = async (message) => {
    const doc = await User.findOne({ user_id: message.author.id }).catch(err => {
        console.log("User does not exist." + err);
        return null;
    });
    return doc;
}

exports.readAll = async () => {
    return await User.find();
}

exports.createUser = async (message) => {
    const newUser = new User({
        user_id: message.author.id,
        username: message.author.username,
    });
    return await newUser.save().catch(err => {
        console.log("No se ha podido crear el usuario." + err);
    })
}

exports.toggleAlarm = async (message) => {
    return this.readUser(message).then(doc => {
        if (!doc) {
            // User does not exist, create one.
            return this.createUser(message).then(newUser => {
                newUser.mudae_alarm = true;
                return newUser.save();
            }).catch(err => {
                console.log("toggleAlarm threw an exception #2" + err);
            });
        } else {
            doc.mudae_alarm = !doc.mudae_alarm;
            return doc.save();
        }
    }).catch(err => {
        console.log("toggleAlarm threw an exception #1" + err);
    });
}

exports.updateFriendship = async (message, value) => {
    return this.readUser(message).then(doc => {
        if (!doc) {
            // User does not exist, create one.
            this.createUser(message).then(user => {
                if ((user.friendship + value >= globals.FS_MIN_VALUE) || (user.friendship + value <= globals.FS_MAX_VALUE)) {
                    user.friendship += value;
                    user.save();
                }
            }).catch(err => {
                console.log("updateFriendship threw an exception #2" + err);
            });
        } else {
            if ((doc.friendship + value >= globals.FS_MIN_VALUE) || (doc.friendship + value <= globals.FS_MAX_VALUE)) {
                doc.friendship += value;
                return doc.save();
            }
        }
    }).catch(err => {
        console.log("updateFriendship threw an exception #1" + err);
    });
}

exports.updateFriendshipAll = async (value) => {
    return this.readAll().then(users => {
        users.forEach(user => {
            if ((user.friendship + value >= globals.FS_MIN_VALUE) || (user.friendship + value <= globals.FS_MAX_VALUE)) {
                user.friendship += value;
                user.save();
            }
        });
    }).catch(err => {
        console.log("updateFriendshipAll threw an exception" + err);
    })
}