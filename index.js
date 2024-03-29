// Load enviromental variables.
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

//////////////////////////////
//////////////////////////////

// Connect to database.
const mongoose = require("mongoose");
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose.set('strictQuery', true); // This means that Mongoose will filter out query filter properties that are not in the schema.
mongoose
    .connect(DB)
    .then((con) => {
        console.log("DB connection succesful.");

        // Proceed with init
        init();
    })
    .catch((err) => {
        console.log("DB connection failed.\n" + err);
    });

//////////////////////////////
//////////////////////////////

const Discord = require("discord.js");
const fs = require("fs");
const globals = require("./globals");
const strings = require("./strings");
const guildController = require("./controllers/guildController");
const { getCurrentServer } = require("./utils");

const AutoPoster = require("topgg-autoposter");

const init = () => {
    console.log("Initiating...");

    const client = new Discord.Client(); // This client.
    global.client = client;
    
    //////////////////////////////
    //////////////////////////////
    
    client.servers = new Discord.Collection(); // A map that stores servers's settings. They key that identifies the server is the guild ID
    
    //////////////////////////////
    //////////////////////////////
    
    client.commands = new Discord.Collection(); // Create a collection of commands.
    
    // Look for commands in the commands folder. They end with .js
    const commandFiles = fs.readdirSync("./commands/").filter((file) => file.endsWith(".js"));
    
    // Loop over the command files and add them to the command collection.
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
    
        client.commands.set(command.name.toLowerCase(), command);
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
        client.user.setActivity("|help in " + client.guilds.cache.size + " servers!", { type: "PLAYING" });
    
        // Get all servers data from DB.
        guildController.readAll().then((docs) => {
            docs.forEach((doc) => {
                client.servers.set(doc.guild_id, doc);
            });
        });
    });
    
    // Bot joined a new server.
    client.on("guildCreate", (guild) => {
        console.log("Joined a new guild: " + guild.name);
        guildController.createGuild(guild).then((doc) => {
            client.servers.set(guild.id, doc);
        });
    });
    
    // Bot left a server.
    client.on("guildDelete", (guild) => {
        console.log("Left a guild: " + guild.name);
        guildController.deleteGuild(guild.id);
        client.servers.delete(guild.id);
    });
    
    //////////////////////////////
    //////////////////////////////
    
    client.on("voiceStateUpdate", (oldState, newState) => {
        if (oldState.member.user.bot) return; // if user is a bot, return.
        // Call OnVoiceStateUpdate functions from modules.
        let modules = client.modules.array();
        modules.forEach((mod) => {
            if (mod.isActivated && mod.OnVoiceStateUpdate !== null) mod.OnVoiceStateUpdate(oldState, newState); // if mod is activated, call function
        });
    });
    
    //////////////////////////////
    //////////////////////////////
    
    // Function to read messages.
    client.on("message", async (message) => {
        // Call OnMessage functions from modules.
        let modules = client.modules.array();
        modules.forEach((mod) => {
            if (mod.isActivated) mod.OnMessage(message); // if mod is activated, call function
        });
    
        /**
         * Check if message is a command for this bot.
         */
        // If message comes from any bot or from system, return;
        if (message.author.bot || message.system) return;
    
        // If a message does not start with the prefix, return.
        try {
            if (!message.content.startsWith(getCurrentServer(message.guild.id).config.prefix)) return;
        } catch (err) {
            return;
        }
    
        // Read the arguments of the command and separate them.
        let args = message.content.substring(getCurrentServer(message.guild.id).config.prefix.length).split(/\s+/);
    
        let cmdName = args[0].toLowerCase();
    
        // If command exists
        if (client.commands.get(cmdName)) {
            client.commands.get(cmdName).execute(message); // execute it
        } else {
            // No command found.
            //message.channel.send(strings.CMD_NOT_FOUND[Math.floor(Math.random() * strings.CMD_NOT_FOUND.length)]);
        }
    });
    
    // Checks time periodically and call OnInterval functions from each module.
    client.setInterval(() => {
        let modules = client.modules.array();
        modules.forEach((mod) => {
            if (mod.isActivated) mod.OnInterval();
        });
    }, globals.time_check_interval);
    
    // Every LOCAL_DATA_INTEGRITY_CHECK_INTERVAL, get server docs from DB and update local collection.
    client.setInterval(() => {
        // Get all servers data from DB.
        guildController.readAll().then((docs) => {
            docs.forEach((doc) => {
                client.servers.set(doc.guild_id, doc);
            });
        });
        // Update activity
        client.user.setActivity("|help in " + client.guilds.cache.size + " servers!", { type: "PLAYING" });
    }, globals.LOCAL_DATA_INTEGRITY_CHECK_INTERVAL);
    
    // DISCORD BOT LIST AUTOPOSTER
    
    if (process.env.DBL_TOKEN) {
        const ap = AutoPoster(process.env.DBL_TOKEN, client);
        ap.on("posted", () => {
            //console.log("Posted stats to Top.gg!");
        });
    }
    
    // Log in this bot.
    client.login(process.env.TOKEN);
}