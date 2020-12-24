const Discord = require("discord.js");
const globals = require("../globals");
const { isActivated } = require("../my_modules/killingGame.");

const rules = [
    { number: 1, descrip: "- Todos comienzan con 7 puntos." },
    { number: 2, descrip: "- Se juegan 7 rondas de Among Us." },
    { number: 3, descrip: "- Hay un descanso luego de 3 rondas." },
    { number: 4, descrip: "- Morir resta 1 punto. Sobrevivir no modifica los puntos." },
    { number: 5, descrip: "- Cada tercer ronda, si el jugador con más puntos muere, intercambia sus puntos con el jugador con menos puntos." },
    { number: 6, descrip: "- Ejecutar a quien no sea traidor resta 1 punto a quienes lo hayan votado." },
    { number: 7, descrip: "- El Ahorcado: Al final de cada ronda, si al menos 4 jugadores han muerto, dichos jugadores juegan a El Ahorcado. El ganador recupera su punto por haber muerto esa ronda." }]

module.exports = {
    name: "reglas",
    descrip: "Muestra las reglas del evento de Monokuma",
    hidden: false,
    execute(message) {
        if (!isActivated) return;
        const embed = new Discord.MessageEmbed()
            .setAuthor("by Monokuma")
            .setTitle("Reglas del juego:")
            .setColor("#ff0000");

        rules.forEach(rule => {
            embed.addFields({ name: rules.number, value: rules.descrip, inline: false });
        });
        embed
            .addFields({ name: "\u200B", value: "\u200B" })
            .setFooter("¡Gracias por confiar en Monokuma!");

        message.react("💀");
        message.channel.send(embed).catch(console.error);
    }
} 