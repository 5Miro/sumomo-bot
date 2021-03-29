const globals = require("../globals");
const User = require("../models/userModel");

/**
 * Reads a user from the database and returns the document.
 * @param {Discord ID of user} _id
 */
exports.readUser = async (_id, _guild_id) => {
	const doc = await User.findOne({ user_id: _id, guild_id: _guild_id }).catch((err) => {
		console.log("User does not exist." + err);
		return null;
	});
	return doc;
};

/**
 * Reads all users from the database and returns the documents.
 * @param {Discord ID of user} _id
 */
exports.readAll = async () => {
	return await User.find().catch((err) => {
		console.log("User does not exist." + err);
		return null;
	});
};

/**
 * Reads all users from a certain guild from the database and returns the documents.
 * @param {Discord ID of user} _id
 */
exports.readAllFromGuild = async (_guild_id) => {
	return await User.find({ guild_id: _guild_id }).catch((err) => {
		console.log("User does not exist." + err);
		return null;
	});
};

/**
 * Creates a new User document and saves it into the database.
 * @param {Discord ID of user} _id
 * @param {Username of user} _username
 */
exports.createUser = async (_id, _username, _guild_id) => {
	const newUser = new User({
		user_id: _id,
		username: _username,
		guild_id: _guild_id,
	});
	return await newUser.save().catch((err) => {
		console.log("No se ha podido crear el usuario." + err);
	});
};

/**
 * Toggles the Mudae alarm of user.
 * @param {Discord ID of user} _id
 * @param {Discord username of user} _username
 */
exports.toggleAlarm = async (_id, _username, _guild_id) => {
	return this.readUser(_id, _guild_id)
		.then((doc) => {
			if (!doc) {
				// User does not exist, create one.
				return this.createUser(_id, _username, _guild_id)
					.then((newUser) => {
						newUser.mudae_alarm = true;
						return newUser.save();
					})
					.catch((err) => {
						console.log("toggleAlarm threw an exception #2" + err);
					});
			} else {
				doc.mudae_alarm = !doc.mudae_alarm;
				return doc.save();
			}
		})
		.catch((err) => {
			console.log("toggleAlarm threw an exception #1" + err);
		});
};

/**
 * Updates FS value of a single user.
 * @param {Discord id of user} _id
 * @param {Discord username of user} _username
 * @param {+ or - variation in friendship} _value
 */
exports.updateFriendship = async (_id, _username, _guild_id, _value) => {
	return this.readUser(_id, _guild_id)
		.then((doc) => {
			if (!doc) {
				// User does not exist, create one.
				this.createUser(_id, _username, _guild_id)
					.then((user) => {
						user.fs_quota += _value;
						user.friendship += _value;
						user.save();
					})
					.catch((err) => {
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
		})
		.catch((err) => {
			//console.log("updateFriendship threw an exception #1" + err);
		});
};

/**
 * Updates friendship to all users at once.
 * @param {+ or - variation in friendship} _value
 * @param {whether it should reset the quota or not} reset_quota
 */
exports.updateFriendshipAll = async (_value, reset_quota) => {
	return this.readAll()
		.then((users) => {
			users.forEach((user) => {
				if (reset_quota) {
					user.fs_quota = 0;
				} else if (_value > 0) {
					user.fs_quota += _value;
				}
				if (user.friendship - _value >= 0) {
					user.friendship += _value;
					user.save().catch((err) => {
						console.log("updateFriendshipAll threw an exception: could not .save() friendship value change");
					});
				}
			});
		})
		.catch((err) => {
			console.log("updateFriendshipAll threw an exception" + err);
		});
};

/**
 * Sets the friendship of all users to a determinated value.
 * @param {New value for everyone} _value
 */
exports.setFriendshipAll = async (_value, _guild_id) => {
	return this.readAllFromGuild(_guild_id)
		.then((users) => {
			users.forEach((user) => {
				user.fs_quota = 0;
				user.friendship = _value;
				user.save();
			});
		})
		.catch((err) => {
			console.log("setFriendshipAll threw an exception" + err);
		});
};
