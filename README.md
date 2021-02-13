# Sumomo

Multipurpose bot for Discord. Sumomo is optimistic, hyperactive and extra kawaii.

## Documentation

**1- Intro**

Sumomo is a node.js application for Discord. It uses the following dependencies:

- Discord.js
  > Allows the app to interact with the Discord API.
- Mongoose
  > Object modeling for MongoDB.
- Dotenv
  > Load enviromental variables from a .env file.
- ytdl-core-discord
  > YouTube downloading module.


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

## Commands

- |help
  > Shows information and commands.
- |lang (value = en | es)
  > Sets Sumomo's language. So far, only english (en) and spanish (es) are available.
- |setPrefix (value)
  > Sets a new prefix for Sumomo's commands.
- |toggleAlarm
  > Subscribes the user to the Mudae Alarm. This is a system that notifies subscribed users when their Mudae rolls and claims are reset. This notification is sent as a DM to each user. That means that if your rolls reset every hour at xx:15 minutes, you will get a DM from Sumomo as a reminder in that exact moment.
  > Default value is FALSE for every user in the server. Every user must execute this command on their own if they want to subscribe.
 - |setMudae (initial_hour) (initial_minutes) (claim_interval) (rolls_interval)
	  > In order to make the Mudae Alarm work as intended, your server's admin must set the alarm to the corresponding time.
	 As an example: setMudae 1 45 3 1 (begins at 01:45, claims every 3 hours, rolls every hour. UTC time zone is used. Initial hour must be set to the earliest valid value as possible. You can setMudae to 14 45 3 1, but it would start counting from 14:45 to 00:00, meaning you would not get any notification from 00:00 to 14:45.
- |config
	> Show server's configuration, such as prefix, language, Mudae's alarm time.
- |fs
	> Shows user's friendship % with Sumomo.
- |resetfs
	> Resets friendship % for all users in the server. Admin only.

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
