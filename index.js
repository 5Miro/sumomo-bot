// Load enviromental variables.
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

//////////////////////////////
////////////////////////////// 

// Connect to database.
const mongoose = require("mongoose");
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(con => {
  console.log("DB connection succesful.");
}).catch(err => {
  console.log("DB connection failed.")
});

//////////////////////////////
//////////////////////////////

const Discord = require("discord.js");
const fs = require("fs");
const globals = require("./globals");
const strings = require("./strings");

const client = new Discord.Client(); // This client.
global.client = client;

//////////////////////////////
//////////////////////////////

client.commands = new Discord.Collection(); // Create a collection of commands.

// Look for commands in the commands folder. They end with .js
const commandFiles = fs.readdirSync("./commands/").filter((file) => file.endsWith(".js"));

// Loop over the command files and add them to the command collection.
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

//////////////////////////////
//////////////////////////////

client.modules = new Discord.Collection(); // Create a collection of commands.

// Look for modules in the my_modules folder. They end with .js
const moduleFiles = fs.readdirSync("./my_modules/").filter((file) => file.endsWith(".js"));

// Loop over the module files and add them to the module collection.
for (const file of moduleFiles) {
  const mod = require(`./my_modules/${file}`);

  client.modules.set(mod.name, mod);
}

//////////////////////////////
//////////////////////////////

// Listeners for the BOT state.
client.once("ready", () => {
  console.log("Sumomo: online");
});

client.on("ready", () => {
  client.user.setActivity(globals.prefix + "help", { type: "PLAYING" });
});

//////////////////////////////
//////////////////////////////

client.on("voiceStateUpdate", (oldState, newState) => {
  if (oldState.member.user.bot) return; // if user is a bot, return.
  // Call OnVoiceStateUpdate functions from modules.
  let modules = client.modules.array();
  modules.forEach(mod => {
    if (mod.isActivated && mod.OnVoiceStateUpdate !== null) mod.OnVoiceStateUpdate(oldState, newState); // if mod is activated, call function
  });
});

//////////////////////////////
//////////////////////////////


// Function to read messages.
client.on("message", async (message) => {
  // Call OnMessage functions from modules.
  let modules = client.modules.array();
  modules.forEach(mod => {
    if (mod.isActivated) mod.OnMessage(message); // if mod is activated, call function
  });

  // If message comes from bot, return;
  if (message.author.bot) return;

  // If a message does not start with the prefix
  if (!message.content.startsWith(globals.prefix)) return;

  // Read the arguments of the command and separate them.
  let args = message.content.substring(globals.prefix.length).split(/\s+/);

  // If command exists
  if (client.commands.get(args[0])) {
    client.commands.get(args[0]).execute(message); // execute it
  } else {
    // No command found.
    //message.channel.send(strings.CMD_NOT_FOUND[Math.floor(Math.random() * strings.CMD_NOT_FOUND.length)]);
  }
});

// Checks time periodically.
client.setInterval(() => {
  let modules = client.modules.array();
  modules.forEach(mod => {
    if (mod.isActivated) mod.OnInterval();
  });

}, globals.time_check_interval);


client.login(process.env.TOKEN);
