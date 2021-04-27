/**
 * DAEMON DICE
 * You are a Daemon, an ancient guardian angel. As such, heroes are assigned to your care.
 * Use |ddNew [name] to request a new hero.
 * Use |ddCheck to see your hero's glory, chance of survival, items, achievements and such.
 *
 * Heroes start with a Glory level 0.
 * Your hero's hunger for glory will make him go on quests every hour. You cannot control whether your hero goes or not.
 * Your hero will always depart at xx:00.
 * Use |ddQuestTime [minutes] to set the exact minutes at which heroes will embark on a quest in your server. (Admin only)
 *
 * Your hero has a chance of success that depends on several factors.
 * To improve your hero's chances of survival, you must roll a Daemon Dice.
 * A Daemon Dice is a D20 dice. The result, from 1 to 20, will be added as a %.
 * Use |ddRoll to roll the dice. You must roll the dice BEFORE he goes on a quest.
 *
 * If your hero survives a quest, he/she gets +1 Glory.
 * Your hero's quests will increase in difficulty until he/she is finally laid to rest.
 * When this happens, as a reward for your help you will receive Momocoins. The amount depends on the achieved Glory level.
 * Once passed, the records of the hero's former glory will be carved into stone in a text-channel of your choice.
 * Use |ddChannel [text-channel-id] to set this channel. The server admin MUST set this value in order for the game to work.
 *
 * The result of each quest is sent through a DM to each user.
 * Use |ddToggleDM to activate/deactivate this feature for you. This is ON by default.
 *
 * You can roll the dice up to 3 times per quest. A new result always overwrites the previous result.
 * Your first roll is free, but the second and the third cost a certain amount of Momocoins.
 *
 * Your hero will gain a new item after returning from a succesful quest as long as you rolled at least a 4 for that quest.
 * Heroes can equip up to 5 items simultaneously.
 * These items will increase your hero's chance of survival for the rest of the adventure. Each item adds a % from +1 to +5.
 * If a hero gains an item after having already 5, he/she can keep this 6th item separately.
 * Use |ddReplaceItem [slot] to replace an old item in the [slot] with the new, 6th item.
 * If you choose not to replace it, this 6th item will be lost on your hero's next quest.
 *
 * Your hero can form a party with another hero. If so, both heroes receive a survival chance bonus %.
 * Use |ddParty [@User] to invite other user to join your hero's party.
 * Parties last until the adventure ends.
 *
 * Your hero's adventure always ends at quest n°10. But who knows? Perhaps we might witness a new LEGEND.
 *
 */

const { User } = require("discord.js");
const { updateDDHeroD20, readAllFromGuild, readUser } = require("../controllers/userController");
const Discord = require("discord.js");
const globals = require("../globals");
const { getSystemString, getModuleString } = require("../strings");

/**
 * COMMANDS:
 * |ddNew [name]                                    ---------- If user has no hero assigned, create a new hero
 * |ddRoll											---------- Rolls a d20. Result is added as a % to your hero's chance of survival.
 * |ddCheck [days]						    		---------- Checks your hero's status and chance of survival for next adventure.
 * |ddChannel [channelID]							---------- set a text-channel ID that will be used to store hero's records.
 * |ddQuestTime [minutes]                           ---------- set the minutes at which heroes go on adventure every hour. Default is xx:00.
 * |ddHelp                           				---------- sets the text-channel id. Default is null. If left blank, will return to null and deactivate
 * |ddToggleDM										---------- toggles DMs on/off
 * |ddParty [@user]									---------- invites another user to your party. Parties share a survival % bonus
 * |ddReplaceItem [slot]							---------- replaces an old item with a new, 6th item in your bag.
 */

const MAX_GLORY = 9;
const CHANCE_PER_GLORY = [90, 70, 60, 50, 40, 30, 25, 15, 10, -25]; //
const MAX_ITEMS = 5;
const CRIT_BAD_PENALTY = -5;
const QUEST_BASE_EXPANSION_SIZE = 100;
const ITEM_BASE_EXPANSION_SIZE = 50;
const MIN_ROLL_FOR_ITEM = 4;
const PARTY_BONUS = [0, 5];
const COINS_PER_GLORY = 50;
const COIN_VARIATION_PER_GLORY = 5;
const END_GAME_BONUS = 500;
const EXTRA_ROLL_COST = 20;
const FINAL_QUEST_INDEX = 101;

module.exports = {
	name: "daemonDice",
	isActivated: true,
	descrip: [
		"Dice RPG minigame. Help your hero reach glory in a series of peculiar quests!",
		"Minijuego de dados RPG. Ayuda a tu héroe a alcanzar la gloria en una serie de peculiares aventuras!",
	],
	OnInterval() {
		// Get date
		let date = new Date();

		let guilds = global.client.servers.array();

		// Check reset time for each guild
		guilds.forEach((server) => {
			// if it's reset time
			if (date.getUTCMinutes() === 0 + server.config.daemonDice.reset_time && date.getUTCSeconds() === 0) {
				// get all users that belong to this server
				readAllFromGuild(server.guild_id).then((users) => {
					users.forEach((user) => {
						// Reset dice rolls
						user.daemonDice.rolls_left = globals.ROLLS_PER_QUEST;

						// Make hero go to quest
						if (user.daemonDice.ddHero !== null) {
							// If hero is not dead nor is a Legend
							if (!user.daemonDice.ddHero.dead && !user.daemonDice.ddHero.legend) {
								// Get random quest. Cannot repeat quest.
								let repeated = true;
								let questIndex = -1;

								// if Glory is max glory, then final quest is always FINAL_QUEST_INDEX
								if (user.daemonDice.ddHero.glory === MAX_GLORY) {
									repeated = false;
									questIndex = FINAL_QUEST_INDEX;
								}

								while (repeated) {
									// Get a random quest index from 0 to EXPANSION_SIZE
									questIndex = parseInt(Math.random() * QUEST_BASE_EXPANSION_SIZE);
									// Filter hero quest array to verify that hero has not done that quest before.
									if (user.daemonDice.ddHero.quests.filter((index) => index === questIndex).length === 0) {
										repeated = false;
									}
								}

								// Roll check
								let random = parseInt(Math.random() * 100); // Get random chance of dying from 0% to 99%
								let chance = this.GetSurvivalChance(user.daemonDice.ddHero);
								let success = chance > random; // If chance of survival is bigger than chance of dying, then quest is succesful

								// If hero survives
								if (success) {
									// Save that quest.
									user.daemonDice.ddHero.quests[user.daemonDice.ddHero.glory] = questIndex;
									// Hero gains 1 glory point.
									user.daemonDice.ddHero.glory++;

									// Check if more than max glory
									if (user.daemonDice.ddHero.glory > MAX_GLORY) {
										user.daemonDice.ddHero.glory = MAX_GLORY;
										user.daemonDice.ddHero.legend = true;
										user.daemonDice.game_overs++;
										// Award coins to user
										let coins = this.GetMomocoins(user.daemonDice.ddHero);
										user.momocoins += coins;
										user.markModified("daemonDice");
										user.save().then((result) => {
											// If hero has more than max glory, then player beated the game
											global.client.channels
												.fetch(server.config.daemonDice.channel_id)
												.then((channel) => {
													channel.send(
														getModuleString("DAEMON_DICE", "THE_END", user.guild_id).PART_1 +
															user.daemonDice.ddHero.name +
															getModuleString("DAEMON_DICE", "THE_END", user.guild_id).PART_2 +
															user.user_id +
															getModuleString("DAEMON_DICE", "THE_END", user.guild_id).PART_3 +
															"\n" +
															user.username +
															getModuleString("MOMOCOINS", "GAIN_COINS", user.guild_id) +
															coins +
															" Momocoins"
													);
												})
												.catch((err) => {
													// Channel ID is not valid.
												});
										});

										return;
									}

									// Haven't finished the game yet.

									// Some block scope variables
									let newItemIndex = -1; // index of the new item
									let repeated = true; // flag for the while loop that get an index
									let equipped = false; // flag to know whether the item was equipped or not
									let slot = -1; // index of the equipped item

									// Hero gains a new item. Cannot repeat item.
									// If daemon dice was bigger than MIN_ROLL_FOR_ITEM
									if (user.daemonDice.ddHero.d20 >= MIN_ROLL_FOR_ITEM) {
										while (repeated) {
											newItemIndex = parseInt(Math.random() * ITEM_BASE_EXPANSION_SIZE);
											// Filter hero record to verify that hero has not done that quest before.
											if (user.daemonDice.ddHero.itemIndex.filter((index) => index === newItemIndex).length === 0) {
												// we got an item, now break the loop.
												repeated = false;
											}
										}

										// Try to equip the item
										for (let i = 0; i < MAX_ITEMS; i++) {
											// if slot is empty
											if (user.daemonDice.ddHero.itemIndex[i] === -1) {
												user.daemonDice.ddHero.itemIndex[i] = newItemIndex; // equip item
												slot = i; // remember slot
												equipped = true;
												break;
											}
											//If no slot is available, item won't be equipped.
										}

										// If not enough space for item, store it in extra slot
										if (!equipped) {
											// Store extra item in extra slot. This is not equipped
											user.daemonDice.ddHero.itemIndex[MAX_ITEMS] = newItemIndex;
											slot = [MAX_ITEMS];
										}
										// Item level depends on d20. Max item level is 5
										user.daemonDice.ddHero.itemLevel[slot] = parseInt(user.daemonDice.ddHero.d20 / 4);
									}

									// Set d20 back to -1
									let previousDD = user.daemonDice.ddHero.d20;
									user.daemonDice.ddHero.d20 = -1;
									user.markModified("daemonDice");
									user.save().then((updated) => {
										// Send PM to the user
										client.users.fetch(user.user_id).then((res) => {
											// If previous roll was enough for an item.
											if (previousDD >= MIN_ROLL_FOR_ITEM) {
												// If said item was equipped
												if (equipped) {
													res.send(
														user.daemonDice.ddHero.name +
															" " +
															this.GetQuestString(
																user.daemonDice.ddHero.quests[user.daemonDice.ddHero.glory - 1],
																server.guild_id
															) +
															getModuleString("DAEMON_DICE", "VICTORY_AND_ITEM", user.guild_id) +
															this.GetItemString(newItemIndex, server.guild_id) +
															" +" +
															user.daemonDice.ddHero.itemLevel[slot]
													);
												}
												// Item was not equipped, but it's available for replacement
												else {
													res.send(
														user.daemonDice.ddHero.name +
															" " +
															this.GetQuestString(
																user.daemonDice.ddHero.quests[user.daemonDice.ddHero.glory - 1],
																server.guild_id
															) +
															getModuleString("DAEMON_DICE", "VICTORY_AND_ITEM", user.guild_id) +
															this.GetItemString(newItemIndex, user.guild_id) +
															" +" +
															user.daemonDice.ddHero.itemLevel[slot] +
															getModuleString("DAEMON_DICE", "NOT_ENOUGH_ROOM_FOR_ITEM", user.guild_id)
													);
												}
											}
											// Hero did not get a new item.
											else {
												res.send(
													user.daemonDice.ddHero.name +
														" " +
														this.GetQuestString(user.daemonDice.ddHero.quests[user.daemonDice.ddHero.glory - 1], server.guild_id) +
														getModuleString("DAEMON_DICE", "VICTORY", user.guild_id)
												);
											}
										});
									});
								} else {
									// Hero died, send post record to text-channel
									user.daemonDice.ddHero.dead = true;

									// Award coins to user depending on hero achievements.
									let coins = this.GetMomocoins(user.daemonDice.ddHero);
									user.momocoins += coins;

									// make a copy of the old party
									let oldParty = user.daemonDice.ddHero.party.map((x) => x);
									user.daemonDice.ddHero.party = []; // delete party

									user.markModified("daemonDice");
									user.save().then((updated) => {
										// if channel_id has been set
										if (server.config.daemonDice.channel_id !== null) {
											global.client.channels
												.fetch(server.config.daemonDice.channel_id)
												.then((channel) => {
													// if channel exists, send message

													// If hero was killed on his last quest
													if (user.daemonDice.ddHero.glory === MAX_GLORY) {
														channel.send(
															"R.I.P.\n" +
																user.daemonDice.ddHero.name +
																getModuleString("DAEMON_DICE", "DEFEAT_BY_DEATH", user.guild_id) +
																"\n" +
																user.username +
																getModuleString("MOMOCOINS", "GAIN_COINS", user.guild_id) +
																coins +
																" Momocoins"
														);

														channel.send(this.GetHeroStatus(user.daemonDice.ddHero, user.guild_id)).catch((err) => {});
													} else {
														channel.send(
															"R.I.P.\n" +
																user.daemonDice.ddHero.name +
																" " +
																this.GetQuestString(questIndex, server.guild_id) +
																getModuleString("DAEMON_DICE", "DEFEAT", user.guild_id) +
																"\n" +
																user.username +
																getModuleString("MOMOCOINS", "GAIN_COINS", user.guild_id) +
																coins +
																" Momocoins"
														);
														channel.send(this.GetHeroStatus(user.daemonDice.ddHero, user.guild_id)).catch((err) => {});
													}
												})
												.catch((err) => {
													// Channel ID is not valid.
												});
										}
										// If has party members, disband party
										if (oldParty.length !== 0) {
											// for each party member
											oldParty.forEach((partyMember) => {
												// read user from DB using ID from party
												readUser(partyMember.id, user.guild_id)
													.then((partyUser) => {
														// remove dead hero from party using filter. Filter elements where element.id is not equal to dead hero's id
														partyUser.daemonDice.ddHero.party = partyUser.daemonDice.ddHero.party.filter(
															(el) => el.id !== user.user_id
														);

														// save party user
														partyUser.markModified("daemonDice");
														partyUser.save().then((updated) => {
															client.users.fetch(partyMember.id).then((res) => {
																// notify this user that the party was disbanded
																res.send(
																	user.daemonDice.ddHero.name +
																		getModuleString("DAEMON_DICE", "PARTY", user.guild_id).DISBANDED
																);
															});
														});
													})
													.catch((err) => {
														console.log("invalid user when disbanding party after death\n" + err);
													});
											});
										}
									});
								}
							}
						}
					});
				});
			}
		});
	},

	OnMessage(message) {
		// This function will be called when a message is read.
	},

	OnVoiceStateUpdate(oldState, newState) {},

	/**
	 * Returns a numeric value that represents the chance of survival of a hero.
	 * @param {*} hero
	 * @returns
	 */
	GetSurvivalChance(hero) {
		// d20 is added as %; unless player rolled a 1, in which case value is actually a fixed penalty
		let d20Modifier = module.exports.GetDDModifierChance(hero.d20);
		let itemModifier = module.exports.GetItemModifierChance(hero.itemLevel);
		let partyModifier = module.exports.GetPartyModifierChance(hero);
		return module.exports.GetBaseChance(hero.glory) + d20Modifier + itemModifier + partyModifier;
	},
	/**
	 * Rolls a dice, updates value in DB and returns said value.
	 * @param {*} user_id
	 * @param {*} guild_id
	 * @returns
	 */
	RollD20(user_id, guild_id) {
		// Roll dice.
		let d20 = parseInt(Math.random() * 20) + 1;
		// Set value into DB.
		updateDDHeroD20(user_id, guild_id, d20);
		// return result.
		return d20;
	},
	/**
	 * Returns a new Hero object with a name.
	 * @param {*} name
	 * @returns
	 */
	CreateHero(name) {
		return new DDHero(name);
	},

	/**
	 * Gets Quest string from index.
	 * @param {*} index
	 * @returns
	 */
	GetQuestString(index, guild_id) {
		return getModuleString("DAEMON_DICE", "QUESTS_1", guild_id)[index];
	},

	/**
	 * Gets Item string from index.
	 * @param {*} index
	 * @returns
	 */
	GetItemString(index, guild_id) {
		return getModuleString("DAEMON_DICE", "ITEMS_1", guild_id)[index];
	},

	/**
	 * Gets survival chance based on glory value.
	 * @param {*} glory
	 * @returns
	 */
	GetBaseChance(glory) {
		return CHANCE_PER_GLORY[glory];
	},

	/**
	 * Gets Item bonus chance of survival based on item level.
	 * @param {*} itemLevel
	 * @returns
	 */
	GetItemModifierChance(itemLevel) {
		return itemLevel.reduce((accumulator, currentValue, i) => (currentValue !== -1 && i !== MAX_ITEMS ? accumulator + currentValue : accumulator), 0);
	},

	/**
	 * Gets party bonus chance of survival based on party length.
	 * @param {*} hero
	 * @returns
	 */
	GetPartyModifierChance(hero) {
		return PARTY_BONUS[hero.party.length];
	},

	/**
	 * Gets chance of survival based on Daemon Dice result.
	 * @param {*} d20
	 * @returns
	 */
	GetDDModifierChance(d20) {
		return d20 === 1 ? CRIT_BAD_PENALTY : d20 === -1 ? 0 : d20;
	},

	/**
	 * Get a Discord embed with hero's stats.
	 * @param {*} hero
	 * @param {*} guild_id
	 * @returns
	 */
	GetHeroStatus(hero, guild_id) {
		const embed = new Discord.MessageEmbed().setTitle(hero.name.toUpperCase());
		let stars = "⭐ ";
		stars = stars.repeat(hero.glory);
		stars ? "" : (stars = "-");

		if (!hero.legend) {
			embed.addFields({ name: getModuleString("DAEMON_DICE", "HERO_STATUS", guild_id).GLORY + hero.glory, value: stars });
		} else {
			embed.addFields({ name: getModuleString("DAEMON_DICE", "HERO_STATUS", guild_id).LEGEND, value: stars });
		}
		embed.addFields({ name: "\u200B", value: "\u200B" });
		if (hero.party) {
			if (hero.party.length !== 0) {
				let partyString = "";
				hero.party.forEach((member) => {
					partyString = partyString.concat(member.name + "\n");
				});
				embed.addFields({ name: getModuleString("DAEMON_DICE", "HERO_STATUS", guild_id).IN_PARTY_WITH, value: partyString });
			}
		}
		embed.addFields({ name: "\u200B", value: "\u200B" });
		let equipmentString = "";
		hero.itemIndex.forEach((item, i) => {
			if (item !== -1 && i !== MAX_ITEMS) {
				equipmentString = equipmentString.concat(
					getModuleString("DAEMON_DICE", "HERO_STATUS", guild_id).SLOT +
						(i + 1) +
						":\n	--  " +
						module.exports.GetItemString(item, guild_id) +
						" (+" +
						hero.itemLevel[i] +
						")\n\n"
				);
			}
		});
		if (equipmentString !== "") {
			embed.addFields({ name: getModuleString("DAEMON_DICE", "HERO_STATUS", guild_id).EQUIPMENT, value: equipmentString, inline: true });
		}

		let questString = "";
		hero.quests.forEach((quest) => {
			questString = questString.concat(module.exports.GetQuestString(quest, guild_id) + "\n\n");
		});
		if (questString !== "") {
			embed.addFields({ name: getModuleString("DAEMON_DICE", "HERO_STATUS", guild_id).ACHIEVEMENTS, value: questString, inline: true });
		}

		embed.addFields({ name: "\u200B", value: "\u200B" });

		// FOOTER TEXT
		if (!hero.dead) {
			if (!hero.legend) {
				// HERO IS ACTIVE
				embed.setFooter(
					getModuleString("DAEMON_DICE", "HERO_STATUS", guild_id).TOTAL_CHANCE +
						module.exports.GetSurvivalChance(hero) +
						"%**" +
						getModuleString("DAEMON_DICE", "HERO_STATUS", guild_id).BASE_CHANCE +
						module.exports.GetBaseChance(hero.glory) +
						"%" +
						getModuleString("DAEMON_DICE", "HERO_STATUS", guild_id).DD_MODIFIER +
						module.exports.GetDDModifierChance(hero.d20) +
						"%" +
						getModuleString("DAEMON_DICE", "HERO_STATUS", guild_id).ITEM_MODIFIER +
						module.exports.GetItemModifierChance(hero.itemLevel) +
						"%" +
						getModuleString("DAEMON_DICE", "HERO_STATUS", guild_id).PARTY_MODIFIER +
						module.exports.GetPartyModifierChance(hero) +
						"%"
				);
			} else {
				// HERO IS LEGEND
				embed.setFooter(getModuleString("DAEMON_DICE", "HERO_STATUS", guild_id).FOOTER_LEGEND);
			}
		} else {
			// HERO IS DEAD
			embed.setFooter(getModuleString("DAEMON_DICE", "HERO_STATUS", guild_id).FOOTER_DEAD);
		}

		embed
			.setColor(globals.embed_color)
			.setAuthor("Daemon Dice", "https://cdn.icon-icons.com/icons2/1465/PNG/512/678gamedice_100992.png", "https://top.gg/bot/769338863947743274");
		return embed;
	},

	/**
	 * Returns a value in Momocoins based on hero's achievements.
	 * @param {*} hero
	 * @returns
	 */
	GetMomocoins(hero) {
		let baseValue = hero.glory * COINS_PER_GLORY;
		let randomVariation = Math.random() * COIN_VARIATION_PER_GLORY * hero.glory;
		let gameOverBonus = hero.legend ? END_GAME_BONUS : 0;
		return parseInt(baseValue + randomVariation + gameOverBonus);
	},
	/**
	 * Returns the cost in Momocoins of rolling an extra dice based on roll's left.
	 * @param {*} rollsLeft
	 * @returns
	 */
	GetExtraRollCost(rollsLeft) {
		return rollsLeft === globals.ROLLS_PER_QUEST ? 0 : EXTRA_ROLL_COST;
	},
	GetMaxPartySize() {
		return PARTY_BONUS.length - 1;
	},
	GetExtraItem(hero) {
		return hero.itemIndex[MAX_ITEMS];
	},
	ReplaceItem(hero, slot) {
		// if slot is not valid
		if (slot < 0 || slot > MAX_ITEMS - 1) {
			return { success: false };
		}
		// Replace slot item with extra item
		hero.itemIndex[slot] = hero.itemIndex[MAX_ITEMS];
		hero.itemLevel[slot] = hero.itemLevel[MAX_ITEMS];
		// erase extra item
		hero.itemIndex[MAX_ITEMS] = -1;
		hero.itemLevel[MAX_ITEMS] = -1;
		return { success: true, payload: { itemIndex: hero.itemIndex, itemLevel: hero.itemLevel } };
	},
};

class DDHero {
	constructor(name) {
		this.name = name;
		this.glory = 0;
		this.d20 = -1;
		this.itemIndex = [-1, -1, -1, -1, -1, -1];
		this.itemLevel = [-1, -1, -1, -1, -1, -1];
		this.dead = false;
		this.quests = [];
		this.legend = false;
		this.party = [];
	}
}
