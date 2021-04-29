# Sumomo

Multipurpose bot for Discord. Sumomo is optimistic, hyperactive and extra kawaii.

UPDATE 25/4/2021:
> v5.6: daemonDice and economy modules introduced!

UPDATE 30/3/2021:
> v5.5: calendar module introduced!

## Documentation

**1- Intro**

Sumomo is a node.js application for Discord. It uses the following dependencies:

-   Discord.js

> Allows the app to interact with the Discord API.

-   Mongoose

> Object modeling for MongoDB.

-   Dotenv

> Load enviromental variables from a .env file.

-   ytdl-core-discord

> YouTube downloading module.

As a modular bot, we can continue to add functionality to its program. This documentation will be updated accordingly.

**2- It works with MongoDB**

MongoDB is a noSQL oriented database system. It does not store data as tables. Instead, it stores a collection of documents as BSON files.

> BSON files are like JSON, but typed.

Sumomo uses a database to store only _this_ information about the discord users that utilize the bot:

-   User's Discord ID

> To identify the user in the database and to mention the user at Discord.

-   Nickname

> As a string for messages in the Discord chat.

-   User's preferences and configurations for Sumomo

> Such as, whether that user has an alarm activated or not.

Sumomo **does not** store any other kind of personal information about the user.

Understand that Sumomo works **through** the Discord API, so it is subjected to its rate limitations.

## Modules

-   music

	> Allows Sumomo to reproduce music from Youtube. Individual songs, playlists and search queries are allowed. Planned improvements: 1) more commands, such as |repeat; 2) support for Spotify.

-   participation

	> Sumomo responds to certain messages with her quirky mannerisms, such as when a user claims/divorces a character in Mudae. Planned improvements: more topics of conversation to react to.

-   mudaeAlarm

	> Sumomo notifies subscribed users when their Mudae rolls and claims are reset. This notification is sent as an individual DM to each user. That means that if your rolls reset every hour at xx:15 minutes, you will get a DM from Sumomo as a reminder in that exact moment. Planned improvements: more intuitive way of changing the alarm settings. Multi-language support.

-   friendship

	> Sumomo gains trust with people that participate in text/voice channels. When somebody she really likes joins a voice channel, she might send him a cute DM to welcome him. Planned improvements: more tangible ways for Sumomo to reward users.

-   cleaning

	> Maintenance module meant to erase Sumomo's old messages in DM channels. Those messages are meant to delete themselves after a period of time, but sometimes they fail to do so.

-  calendar
	>Users register events, such as birthdays or get-togethers, into the calendar. 
	
	>If a text-channel id is provided, Sumomo will post the upcoming events on it everyday and the month's calendar.
	
	>Events, by default, get deleted the day after they occur. 
	
	>For yearly events such as birthdays, the repeat flag must be added to the command. Events with the "repeat" flag on will be rescheduled for the next year the day after they expire. 
	
	>	Users can adjust the time zone of the calendar so Sumomo can time the events more accurately.

- daemonDice
	> A dice RPG game where users roll dice to help their heroes accomplished very peculiar quests written by Sumomo's quirky and fun creativity.
	
	> Users gain Momocoins for playing.
	
- economy (UNDER WORK)
	> Users can gain Momocoins through other modules and then spend their currency on unlockable content.

## Commands

-   |help

> Shows information and commands.

-   |lang (value = en | es)

> Sets Sumomo's language. So far, only english (en) and spanish (es) are available. Admin only.

-   |setPrefix (newPrefix)

> Sets a new prefix for Sumomo's commands. Admin only.

-   |toggleAlarm

> Subscribes the user to the Mudae Alarm. This is a system that notifies subscribed users when their Mudae rolls and claims are reset. This notification is sent as an individual DM to each user. That means that if your rolls reset every hour at xx:15 minutes, you will get a DM from Sumomo as a reminder in that exact moment.

> Default value is FALSE for every user in the server, so each one must execute this command on their own if they want to subscribe.

-   |setMudae (initial_hour) (initial_minutes) (claim_interval) (rolls_interval)

> In order to make the Mudae Alarm work as intended, your server's admin must set the alarm to the corresponding time.

> As an example: setMudae 1 45 3 1 (begins at 01:45, claims every 3 hours, rolls every hour. UTC time zone is used. Initial hour must be set to the earliest valid value as possible. You can setMudae to 14 45 3 1, but it would start counting from 14:45 to 00:00, meaning you would not get any notification from 00:00 to 14:45.

-   |config

> Show server's configuration, such as prefix, language, Mudae's alarm time.

-   |fs

> Shows user's friendship % with Sumomo. Friendship is gained through participating in text and voice channels. Points are lost through inactivity.

-   |resetfs

> Resets friendship % for all users in the server. Admin only.

**Music commands**

-   |play (link, playlist, search query)

> Add a song or playlist from Youtube, or search for a song.

-   |pause

> Pause the music.

-   |resume

> Resumes song after being paused.

-   |stop

> Stops the music and disconnects the bot.

-   |skip

> Skips current song.

-   |list

> Shows songs in queue.

**Calendar commands**

-	|calendarNew [repeat] [dd/MM/YYYY] [description]
	> Add an event to the calendar.
	
	>If you skip the year, current year will be used as default.
	
	>For annual events, use |calendarNew **repeat** dd/mm/YYYY [description]
	Annual events will be rescheduled automatically!
	
	>Example 1: |calendarNew repeat 23/10/2021 Sumomo's birthday
	>Example 2: |calendarNew 5/2/2021 one-time-only top-secret meeting
-	|calendarCheck [days]
	>Use it to see the upcoming events in the following [days]. If you skip the [days] value, this will be 15 by default.
-	|calendarChannel [text-channel ID]
	>Set a text-channel ID so Sumomo can remind of upcoming events daily on that text-channel.	
-	|calendarTimezone [-12 to 12]
	>Set a particular timezone for the calendar. -12 to 12 only so far. If you are outside this range, contact me and I'll work it out :)
-	|calendarHelp
	> Get a explanation of the calendar commands.

**Daemon Dice commands**


 You are a Daemon, an ancient guardian angel. As such, heroes are assigned to your care.

* Use |ddNew [name] to request a new hero.

* Use |ddCheck to see your hero's glory, chance of survival, items, achievements and such.

 Heroes start with a Glory level 0.

 Your hero's hunger for glory will make him go on quests every hour. You cannot control whether your hero goes or not.

 Your hero will always depart at xx:00.

* Use |ddQuestTime [minutes] to set the exact minutes at which heroes will embark on a quest in your server. (Admin only)

 Your hero has a chance of success that depends on several factors.

 To improve your hero's chances of survival, you must roll a Daemon Dice.

 A Daemon Dice is a D20 dice. The result, from 1 to 20, will be added as a %.

* Use |ddRoll to roll the dice. You must roll the dice BEFORE he goes on a quest.

 If your hero survives a quest, he/she gets +1 Glory.

 Your hero's quests will increase in difficulty until he/she is finally laid to rest.

 When this happens, as a reward for your help you will receive Momocoins. The amount depends on the achieved Glory level.

 Once passed, the records of the hero's former glory will be carved into stone in a text-channel of your choice.

* Use |ddChannel [text-channel-id] to set this channel. The server admin MUST set this value in order for the game to work properly.


 The result of each quest is sent through a DM to each user.

* Use |ddToggleDM to activate/deactivate this feature for you. This is ON by default.

You can roll the dice up to 3 times per quest. A new result always overwrites the previous result.

> Your first roll is free, but the second and the third cost 20 Momocoins each.

Your hero will gain a new item after returning from a succesful quest as long as you rolled at least a 4 for that quest.

>Heroes can equip up to 5 items simultaneously.

These items will increase your hero's chance of survival for the rest of the adventure. Each item adds a % from +1 to +5.

If a hero gains an item after having already 5, he/she can keep this 6th item separately.

* Use |ddReplaceItem [slot] to replace an old item in the [slot] with the new, 6th item.

* If you choose not to replace it, this 6th item will be lost on your hero's next quest.


 Your hero can form a party with another hero. If so, both heroes receive a survival chance bonus %.

* Use |ddParty [@User] to invite other user to join your hero's party.

> Parties last until your or your party member's adventure ends.

Your hero's adventure always ends at quest n°10. But who knows? Perhaps we might witness a new LEGEND.

## Developer notes

Sumomo was initially created by me for personal use only. She had no name at first and my friends and I used her as an alarm for Mudae mostly. However, I wanted to give that cold bot a personality and charisma. A friend of mine suggested Sumomo, from Chobits, as a source of inspiration for her.

She is a small bot made with affection. I thought of adapting her to public use, for anyone willing to give Sumomo some love.

## Sumomo's future

In the short term, my priorities are giving Sumomo more functionality, while keeping her working properly, fixing bugs and crashes that might spawn. 

So far since published on top.gg, I have added:
.calendar
.daemonDice
.economy (UNDER WORK)

In the medium term, I'm working on making Sumomo a verified bot by Discord.



# Thanks for using Sumomo

PS: I would appreciate if you could vote for Sumomo on DBL (https://top.gg/bot/769338863947743274)!

Sincerely,
Miro

> Written with [StackEdit](https://stackedit.io/).
