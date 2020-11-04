const globals = require("../globals");
const User = require("../models/userModel");

exports.readUser = async (_id) => {
    const doc = await User.findOne({ user_id: _id }).catch(err => {
        console.log("User does not exist." + err);
        return null;
    });
    return doc;
}

exports.readAll = async () => {
    return await User.find();
}

exports.createUser = async (_id, _username) => {
    const newUser = new User({
        user_id: _id,
        username: _username,
    });
    return await newUser.save().catch(err => {
        console.log("No se ha podido crear el usuario." + err);
    })
}

exports.toggleAlarm = async (_id, _username) => {
    return this.readUser(_id).then(doc => {
        if (!doc) {
            // User does not exist, create one.
            return this.createUser(_id, _username).then(newUser => {
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

exports.updateFriendship = async (_id, _username, _value) => {
    return this.readUser(_id).then(doc => {
        if (!doc) {
            // User does not exist, create one.
            this.createUser(_id, _username).then(user => {
                user.fs_quota += _value;
                user.friendship += _value;
                user.save();
            }).catch(err => {
                console.log("updateFriendship threw an exception #2" + err);
            });
        } else {
            // if fs quota is not full
            if (doc.fs_quota < globals.FS_MAX_QUOTA) {
                // if value would not exceed quota
                if (doc.fs_quota + _value <= globals.FS_MAX_QUOTA) {
                    doc.fs_quota += _value;
                    doc.friendship += _value;
                    return doc.save();
                } else {
                    // if value would exceed quota, add remaining fs points to reach max quota
                    doc.friendship += globals.FS_MAX_QUOTA - doc.fs_quota;
                    doc.fs_quota = globals.FS_MAX_QUOTA;
                    return doc.save();
                }
            }
            return doc;
        }
    }).catch(err => {
        //console.log("updateFriendship threw an exception #1" + err);
    });
}

exports.updateFriendshipAll = async (_value, reset_quota) => {
    return this.readAll().then(users => {
        users.forEach(user => {
            if (reset_quota) {
                user.fs_quota = 0;
            } else {
                user.fs_quota += _value;
            }
            user.friendship += _value;
            user.save();
        });
    }).catch(err => {
        console.log("updateFriendshipAll threw an exception" + err);
    })
}

exports.setFriendshipAll = async (_value) => {
    return this.readAll().then(users => {
        users.forEach(user => {
            user.fs_quota = 0;
            user.friendship = _value;
            user.save();
        });
    }).catch(err => {
        console.log("setFriendshipAll threw an exception" + err);
    })
}