// Load enviromental variables.
const dotenv = require("dotenv");
dotenv.config({path: "./config.env"});

//////////////////////////////
////////////////////////////// 

const mongoose = require("mongoose");
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DB_PASSWORD);

// Connect to database.
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(con => {
  console.log("DB connection succesful.");
}).catch( err => {
  console.log("DB connection failed.")
});

//////////////////////////////
//////////////////////////////

const Discord = require("discord.js");
const fs = require("fs");
const userController = require("./controllers/userController");

const prefix = "|"; // Prefix to identify commands.
const client = new Discord.Client(); // This client.

var servers = new Map(); // A map that stores servers.

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
  console.log("Mudae alarm: online");
});

client.on("ready", () => {
  client.user.setActivity("|sub o |unsub", {type: "PLAYING"});
});

//////////////////////////////
//////////////////////////////

// Function to read messages.
client.on("message", async (message) => {
  // If message comes from bot, return;
  if (message.author.bot) return;

  // If a message does not start with the prefix
  if (!message.content.startsWith(prefix)) return;

  // Read the arguments of the command and separate them.
  let args = message.content.substring(prefix.length).split(/\s+/);

  // Loop through all comands to find the right one.
  if (client.commands.get(args[0])) {
    client.commands.get(args[0]).execute(message);
  } else {
    // No command found.
    message.channel.send("Comando no reconocido.");
  }  
});

//////////////////////////////
//////////////////////////////

const INITIAL_HOUR = 4; // in hours (UTC time zone)
const INITIAL_MINUTES = 14; // in minutes
const CLAIM_INTERVAL = 3; // in hours
const TIME_CHECK_INTERVAL = 60000 // in miliseconds

// Checks time periodically.
client.setInterval(() => {
  // Get current time and date.
  const date = new Date();

  // First check ROLLS
  if (date.getUTCMinutes() == INITIAL_MINUTES) {
    // Rolls reset.
    ringAlarm("-sama, le recuerdo que sus rolls fueron reseteados.");
  }

  // Then check CLAIMS.
  for (i = INITIAL_HOUR; i < 24; i += CLAIM_INTERVAL) {
    if (date.getUTCHours() == i && date.getUTCMinutes() == INITIAL_MINUTES) {
      ringAlarm(", también se ha reseteado su claim.");
      return;
    }
  }

}, TIME_CHECK_INTERVAL);

// Get users from DB and then send DM.
async function ringAlarm(string) {
  // get users from db.
  const users = await userController.readAll();
  // For each document in user database, fetch user from id and send a DM.
  for(const doc of users) {
    if (!doc.mudae_alarm) continue;
    client.users.fetch(doc.user_id).then(user => {
      user.send(doc.username + string).catch(err => {
        console.log("No se ha podido enviar el DM\n" + err);
      });
    });
  }
}

client.login(process.env.TOKEN);
