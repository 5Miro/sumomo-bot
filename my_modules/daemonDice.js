/**
 * DAEMON DICE
 * You are a Daemon, an ancient guardian angel. A hero is born and assigned to your care.
 * Your hero's hunger for glory will make him go on adventures every hour.
 * Roll a D20 dice. The result will increase your hero's chances of success.
 * But nothing lasts forever. Your hero's adventures will increase in difficulty until he/she is finally laid to rest.
 * Once passed, the records of his/her former glory will be carved into stone in a text-channel of your choice.
 *
 * |ddNew [name] creates a new Hero. From there, hero is sent to an adventure every xx:00.
 * You have until xx:00 to roll a dice to help him. The dice will improve hero's chances of survival substantially.
 * The 10th battle is always against Death itself. Your hero always dies there unless you rolled a d20.
 * If hero cheats death, it ascends into a Demi God and his/her adventure ends there.
 * After a succesful adventure, hero obtains a consumable item that will be used automatically in the next encounter
 * and will improve chances of survival, from 1% to 10%.
 * Records are store in your server's graveyard (a text-channel ID must be provided)
 *
 */

const { User } = require("discord.js");
const { updateDDHeroD20, readAllFromGuild, readUser } = require("../controllers/userController");
const Discord = require("discord.js");
const globals = require("../globals");
const { getSystemString, getModuleString } = require("../strings");

/**
 * COMMANDS:
 * ddNew [name]                                     ---------- If user has no hero assigned, create a new hero
 * ddRoll											---------- Rolls a d20. Result is added as a % to your hero's chance of survival.
 * ddCheck [days]						    		---------- Checks your hero's status and chance of survival for next adventure.
 * ddChannel [channelID]							---------- set a text-channel ID that will be used to store hero's records.
 * ddResetTime [minutes]                            ---------- set the minutes at which heroes go on adventure every hour. Default is xx:00.
 * ddHelp                           				---------- sets the text-channel id. Default is null. If left blank, will return to null and deactivate
 */

const MAX_GLORY = 10;
const CHANCE_PER_GLORY = [90, 70, 60, 50, 40, 30, 25, 15, 10, -25]; //
const MAX_ITEMS = 5;
const CRIT_BAD_PENALTY = -5;
const QUEST_BASE_EXPANSION_SIZE = 100;
const ITEM_BASE_EXPANSION_SIZE = 100;
const MIN_ROLL_FOR_ITEM = 4;
const PARTY_BONUS = [0, 5, 12];
const COINS_PER_GLORY = 50;
const COIN_VARIATION_PER_GLORY = 5;
const END_GAME_BONUS = 500;
const EXTRA_ROLL_COST = 20;
const FINAL_QUEST_INDEX = 100;

module.exports = {
	name: "daemonDice",
	isActivated: true,
	descrip: ["Dice RPG minigame. Help your hero reach glory in death!", "Minijuego de dados RPG. Ayuda a tu héroe a alcanzar la gloria en la muerte!"],
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
								// Assign that quest.
								user.daemonDice.ddHero.quests[user.daemonDice.ddHero.glory - 1] = questIndex;

								// Roll check
								let random = parseInt(Math.random() * 100); // Get random chance of dying from 0% to 99%
								let chance = this.GetSurvivalChance(user.daemonDice.ddHero);
								let success = chance > random; // If chance of survival is bigger than chance of dying, then quest is succesful

								// If hero survives
								if (success) {
									// Hero gains 1 glory point.
									user.daemonDice.ddHero.glory++;

									// Check if more than max glory
									if (user.daemonDice.ddHero.glory > MAX_GLORY) {
										user.daemonDice.ddHero.glory = MAX_GLORY;
										user.daemonDice.ddHero.legend = true;
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
															this.GetQuestString(user.daemonDice.ddHero.quests[user.daemonDice.ddHero.glory - 2]) +
															getModuleString("DAEMON_DICE", "VICTORY_AND_ITEM", user.guild_id) +
															this.GetItemString(newItemIndex) +
															" +" +
															user.daemonDice.ddHero.itemLevel[slot]
													);
												}
												// Item was not equipped, but it's available for replacement
												else {
													res.send(
														user.daemonDice.ddHero.name +
															" " +
															this.GetQuestString(user.daemonDice.ddHero.quests[user.daemonDice.ddHero.glory - 2]) +
															getModuleString("DAEMON_DICE", "VICTORY_AND_ITEM", user.guild_id) +
															this.GetItemString(newItemIndex) +
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
														this.GetQuestString(user.daemonDice.ddHero.quests[user.daemonDice.ddHero.glory - 2]) +
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

									user.markModified("daemonDice");
									user.save().then((updated) => {
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
													} else {
														channel.send(
															"R.I.P.\n" +
																user.daemonDice.ddHero.name +
																" quest n°: " +
																questIndex +
																getModuleString("DAEMON_DICE", "DEFEAT", user.guild_id) +
																"\n" +
																user.username +
																getModuleString("MOMOCOINS", "GAIN_COINS", user.guild_id) +
																coins +
																" Momocoins"
														);
													}
												})
												.catch((err) => {
													// Channel ID is not valid.
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
	GetQuestString(index) {
		return "quest " + index;
	},

	/**
	 * Gets Item string from index.
	 * @param {*} index
	 * @returns
	 */
	GetItemString(index) {
		return "item " + index;
	},

	/**
	 * Gets survival chance based on glory value.
	 * @param {*} glory
	 * @returns
	 */
	GetBaseChance(glory) {
		return CHANCE_PER_GLORY[glory - 1];
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

		if (!hero.legend) {
			embed.setDescription(getModuleString("DAEMON_DICE", "HERO_STATUS", guild_id).GLORY + hero.glory);
		} else {
			embed.setDescription(getModuleString("DAEMON_DICE", "HERO_STATUS", guild_id).LEGEND);
		}
		if (hero.party) {
			if (hero.party.length !== 0) {
				let partyString = "";
				hero.party.forEach((member) => {
					partyString = partyString.concat(member + "\n");
				});
				embed.addFields({ name: getModuleString("DAEMON_DICE", "HERO_STATUS", guild_id).IN_PARTY_WITH, value: partyString });
			}
		}
		embed.addFields({ name: "\u200B", value: "\u200B" });
		let equipmentString = "";
		hero.itemIndex.forEach((item, i) => {
			if (item !== -1 && i !== MAX_ITEMS) {
				equipmentString = equipmentString.concat(
					getModuleString("DAEMON_DICE", "HERO_STATUS", guild_id).SLOT + (i + 1) + ":\n	--  " + item + " (+" + hero.itemLevel[i] + ")\n\n"
				);
			}
		});
		if (equipmentString !== "") {
			embed.addFields({ name: getModuleString("DAEMON_DICE", "HERO_STATUS", guild_id).EQUIPMENT, value: equipmentString, inline: true });
		}

		let questString = hero.quests.join("\n\n");
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
};

class DDHero {
	constructor(name) {
		this.name = name;
		this.glory = 1;
		this.d20 = -1;
		this.itemIndex = [-1, -1, -1, -1, -1, -1];
		this.itemLevel = [-1, -1, -1, -1, -1, -1];
		this.dead = false;
		this.quests = [];
		this.legend = false;
		this.party = [];
	}
}
