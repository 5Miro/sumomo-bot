const { readUser } = require("../controllers/userController");
const { GetMaxPartySize } = require("../my_modules/daemonDice");
const { getModuleString, getSystemString } = require("../strings");

module.exports = {
	name: "ddParty",
	descrip: ["Invite a user to join your Daemon Dice party.", "Invita a un usuario a unirse a tu party de Daemon Dice."],
	hidden: false,
	execute(message) {
		// Read the arguments of the command and separate them.
		let args = message.content.split(/\s+/);

		if (!args[1]) {
			// Did not tag any user.
			return message.channel.send(message.member.displayName + getModuleString("DAEMON_DICE", "PARTY", message.guild.id).NO_TAG_ERROR);
		}
		// remove <@!> to get user ID
		let targetUserID = args[1].substring(3, args[1].length - 1);

		// check that target id is not user id

		if (targetUserID === message.member.id) {
			// you cannot form a party with yourself.
			return message.channel.send(message.member.displayName + getModuleString("DAEMON_DICE", "PARTY", message.guild.id).SELF_PARTY_ERROR);
		}

		// Fetch sender user
		readUser(message.member.id, message.guild.id)
			.then((user) => {
				// check if hero is available
				if (user.daemonDice.ddHero.dead || user.daemonDice.ddHero.legend) {
					// hero cannot form a party
					return message.channel.send(message.member.displayName + getModuleString("DAEMON_DICE", "PARTY", message.guild.id).HERO_UNAVAILABLE);
				}
				// check if target user is already in party with user
				if (user.daemonDice.ddHero.party.some((id) => id === targetUserID)) {
					// this target user is already in a party with user
					return message.channel.send(message.member.displayName + getModuleString("DAEMON_DICE", "PARTY", message.guild.id).ALREADY_IN_PARTY);
				}

				// check if party is full
				if (user.daemonDice.ddHero.party.length >= GetMaxPartySize()) {
					// party is full
					return message.channel.send(message.member.displayName + getModuleString("DAEMON_DICE", "PARTY", message.guild.id).FULL_PARTY);
				}

				console.log("caca");
				// user is available for party.
				// Filter: only collect messages whose author is the tagged user. Also, messages should be either affirmative or negative (y/n)
				let filter = (m) =>
					m.author.id === targetUserID &&
					(m.content.toLowerCase() === getSystemString("AFFIRMATIVE", message.guild.id) ||
						m.content.toLowerCase() === getSystemString("NEGATIVE", message.guild.id));

				// Await for user's response.
				message.channel
					.awaitMessages(filter, { max: 1, time: 10000 })
					.then((collected) => {
						// get msg
						let msg = collected.array()[0];

						// if msg exists
						if (msg !== undefined) {
							// Affirmative response
							if (msg.content.toLowerCase() === getSystemString("AFFIRMATIVE", message.guild.id)) {
								// fetch user from DB.
								readUser(targetUserID, message.guild.id).then((targetUser) => {
									// check if hero is available
									if (targetUser.daemonDice.ddHero.dead || targetUser.daemonDice.ddHero.legend) {
										// hero cannot form a party
										return message.channel.send(
											targetUser.username + getModuleString("DAEMON_DICE", "PARTY", message.guild.id).HERO_UNAVAILABLE
										);
									}
									// check if target user is already in party with user
									if (targetUser.daemonDice.ddHero.party.some((id) => id === message.member.id)) {
										// this target user is already in a party with user
										return message.channel.send(
											targetUser.username + getModuleString("DAEMON_DICE", "PARTY", message.guild.id).ALREADY_IN_PARTY
										);
									}
									// check if party is full
									if (targetUser.daemonDice.ddHero.party.length >= GetMaxPartySize()) {
										// party is full
										return message.channel.send(targetUser.username + getModuleString("DAEMON_DICE", "PARTY", message.guild.id).FULL_PARTY);
									}
									// update party member in receiver
									targetUser.daemonDice.ddHero.party[targetUser.daemonDice.ddHero.party.length] = message.member.id;
									targetUser.markModified("daemonDice");
									// save target user
									targetUser.save().then((confirm1) => {
										// if succesful, update party member in sender
										user.daemonDice.ddHero.party[user.daemonDice.ddHero.party.length] = targetUserID;
										user.markModified("daemonDice");
										user.save().then((confirm2) => {
											// send confirmation message
											return message.channel.send(
												message.member.displayName +
													" & " +
													targetUser.username +
													getModuleString("DAEMON_DICE", "PARTY", message.guild.id).ACCEPTED
											);
										});
									});
								});
							} else {
								// Reject invitation. Send message
								return message.channel.send(message.member.displayName + getModuleString("DAEMON_DICE", "PARTY", message.guild.id).DECLINED);
							}
						} else {
							// Send no response
							return message.channel.send(message.member.displayName + getModuleString("DAEMON_DICE", "PARTY", message.guild.id).TIMEOUT);
						}
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.catch((err) => {
				// id not valid
			});
	},
};
