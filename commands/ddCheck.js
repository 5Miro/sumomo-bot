const { updateDDHeroD20, readDDHero } = require("../controllers/userController");

const { GetSurvivalChance, GetBaseChance, GetDDModifierChance, GetItemModifierChance, GetHeroStatus } = require("../my_modules/daemonDice");
module.exports = {
	name: "ddCheck",
	descrip: ["Shows the status of your current hero.", "Muestra el estado de tu héroe actual."],
	hidden: false,
	execute(message) {
		readDDHero(message.member.id, message.guild.id).then((user) => {
			let hero = user.daemonDice.ddHero;
			const embed = GetHeroStatus(hero);
			

			message.react("❤").catch((err) => {});
			message.channel.send(embed).catch(console.error);
		});
	},
};
