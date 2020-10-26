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
const userController = require("./controllers/userController");
const globals = require("./globals");
const strings = require("./strings");

const client = new Discord.Client(); // This client.

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

// Listeners for the BOT state.
client.once("ready", () => {
  console.log("Sumomo: online");
});

client.on("ready", () => {
  client.user.setActivity("|help", { type: "PLAYING" });
});

//////////////////////////////
//////////////////////////////

// Function to read messages.
client.on("message", async (message) => {
  // If message comes from bot, return;
  if (message.author.bot) return;

  // If a message does not start with the prefix
  if (!message.content.startsWith(globals.prefix)) return;

  // Read the arguments of the command and separate them.
  let args = message.content.substring(globals.prefix.length).split(/\s+/);

  // Loop through all comands to find the right one.
  if (client.commands.get(args[0])) {
    client.commands.get(args[0]).execute(message);
  } else {
    // No command found.
    message.channel.send(strings.CMD_NOT_FOUND);
  }
});

//////////////////////////////
//////////////////////////////

// Checks time periodically.
client.setInterval(() => {
  // Get current time and date.
  const date = new Date();

  // First check MINUTES
  if (date.getUTCMinutes() == globals.initial_minutes) {
    // Rolls reset.
    // Now check HOURS
    for (i = globals.initial_hour; i < globals.hours_per_day; i += globals.claim_interval) {
      if (date.getUTCHours() == i) {
        ringAlarm(strings.RESET_CLAIMS[Math.floor(Math.random() * strings.RESET_CLAIMS.length)]); // get random string
        return;
      }
    }
    // No claims, but still rolls
    ringAlarm(strings.RESET_ROLLS[Math.floor(Math.random() * strings.RESET_ROLLS.length)]); // get random string
  }

}, globals.time_check_interval);

// Get users from DB and then send DM.
async function ringAlarm(string) {
  // get users from db.
  const users = await userController.readAll();
  // For each document in user database, fetch user from id and send a DM.
  for (const doc of users) {
    if (!doc.mudae_alarm) continue;
    client.users.fetch(doc.user_id).then(user => {
      user.send(doc.username + string).catch(err => {
        console.log("No se ha podido enviar el PM\n" + err);
      });
    });
  }
}

client.login(process.env.TOKEN);
