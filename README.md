# Sumomo

Multipurpose bot for Discord. Non-public bot, for personal use only.

## Documentation

**1- Intro**

Sumomo is a node.js application for Discord. It uses the following dependencies:

- Discord.js
  > Allows the app to interact with the Discord API.
- Mongoose
  > Object modeling for MongoDB.
- Dotenv
  > Load enviromental variables from a .env file.

As a modular bot, we can continue to add functionality to its program. This
documentation will be updated accordingly.

**2- It works with MongoDB**

MongoDB is a noSQL oriented database system. It does not store data as tables.
Instead, it stores a collection of documents as BSON files.

> BSON files are like JSON, but typed.

Sumomo uses a database to store only _this_ information about the discord users
that utilize the bot:

- User's Discord ID
  > To identify the user in the database and to mention the user at Discord.
- Nickname
  > As a string for messages in the Discord chat.
- User's preferences and configurations for Sumomo
  > Such as, whether that user has an alarm activated or not.

Sumomo **does not** store any other kind of personal information about the user.
Understand that Sumomo works **through** the Discord API.

Sumomo is **NOT** a public bot. Sumomo was built for personal use only. That
means that whoever uses Sumomo's source code must provide **their own** app and
database hosting.

**3- Modular behaviour**

Sumomo is a modular-based bot. Each module adds a new functionality through .js
file contained in the "modules" folder. Said file has the following structure:

// exampleModule.js

```
module.exports  =  {

	name:  "exampleModule",

	isActivated:  false, // whether it should be running or not

	descrip:  "So descriptive!",

	OnInterval()  {
		// This function is called periodically. Time interval is set on config.js
	},

	OnMessage(message)  {
		// This function will be called when a message is read. Avoid using this function to create custom commands. See "5- Custom commands".
	},

	OnVoiceStateUpdate(oldState,  newState)  {
		// This function will be called when a user's voice state changes. (For example, a user connects to a voice channel)
	}

}
```

**4- Default commands**

- |help
  > Shows information and commands.
- |modules
  > Lists every module and their state.
- |toggleModule (moduleName)
  > Toggles a module on/off.

**5- Custom commands**

You can add custom commands in the "commands" folder. These .js files have the
following structure:

// exampleCommand.js

```
module.exports  =  {

	name:  "exampleCommand",

	descrip:  "This info will show on |modules command",

	hidden:  false, // Whether to hide it from the |modules command or not

	execute(message)  {
		// This code will be executed when the command is called.
	}
}
```

# Thanks for using Sumomo

> Written with [StackEdit](https://stackedit.io/).
