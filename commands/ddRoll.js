const { updateDDHeroD20 } = require("../controllers/userController");
const { RollD20 } = require("../my_modules/daemonDice");

module.exports = {
	name: "ddRoll",
	descrip: ["Roll a Daemon Dice to aid your hero.", "Tira un Dado Daemon para asistir a tu héroe."],
	hidden: false,
	execute(message) {
		let d20 = RollD20(message.member.id, message.guild.id);
		message.channel.send("You rolled a " + d20);
	},
};
