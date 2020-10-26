# Sumomo
Multipurpose bot for Discord. Non-public bot, for personal use only.
## Documentation
**1- Intro**
Sumomo is a node.js application for Discord. It uses the following modules:
- Discord.js
> Allows the app to interact with the Discord API.
- Mongoose
> Object modeling for MongoDB.
- Dotenv
> Load enviromental variables from a .env file.

As  a modular bot, Sumomo will continue to add functionality to its program. This documentation will be updated accordingly.

**2- It works with MongoDB**
MongoDB is a noSQL oriented database system. It does not store data as tables. Instead, it stores a collection of documents as BSON files.
> BSON files are like JSON, but typed.

Sumomo uses a database to store only *this* information about the discord users that utilize the bot:
- User's Discord ID
> To identify the user in the database and to mention the user at Discord.
- Nickname
> As a string for messages in the Discord chat.
- User's preferences and configurations for Sumomo
> Such as, whether that user has the Mudae Alarm activated or not.

Sumomo **does not** store any other kind of personal information about the user. Understand that Sumomo works **through** the Discord API.

Sumomo is **NOT** a public bot. Sumomo was built for personal use only. That means that whoever uses Sumomo must provide **their own** database through the enviromental variables.

**3- Commands**

- |help
> Show information and commands.
- |togglealarm
> User will receive DMs when Mudae's rolls and claims are reseted. This is not an integration with Mudae. Server admin must set the corresponding time-related configurations for the alarm to work as intended.

# Thanks for using Sumomo

> Written with [StackEdit](https://stackedit.io/).
