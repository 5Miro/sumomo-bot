const Discord = require("discord.js");
const ytdl = require("ytdl-core-discord"); // A youtube downloader required to play music.
const globals = require("../globals");
const YouTubeAPI = require("simple-youtube-api");
const { getQueues, isActivated } = require("../my_modules/music");
const strings = require("../strings");
const youtube = new YouTubeAPI(process.env.YOUTUBE_API_KEY);

const defaultVolume = 0.5;

module.exports = {
	name: "play",
	descrip: ["Add a song or playlist from Youtube, or search for a song.", "Agrega un link de canción o playlist de Youtube, o busca una canción."],
	hidden: false,
	execute(message) {
		if (!isActivated) return;

		// Look at the map that contains all the music queues from all servers, then look for the server with the guild id from the message.
		const serverQueue = getQueues().get(message.guild.id);
		servers = getQueues();

		// Get the name of the channel.
		const voiceChannel = message.member.voice.channel;

		// If user is not connected to a voice channel, then return.
		if (!voiceChannel) {
			message.react("👀").catch(console.error);
			return message.channel.send(strings.getModuleString("MUSIC", "NO_VOICE_CHANNEL", message.guild.id)).catch(console.error);
		}

		// Get the permissions of this bot.
		const permissions = voiceChannel.permissionsFor(message.client.user);

		// Check if bot has the necessary permissions.
		if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
			message.react("👀").catch(console.error);
			return message.channel.send(strings.getModuleString("MUSIC", "LACK_PERMISSIONS", message.guild.id)).catch(console.error);
		}

		// Read the arguments of the command and separate them.
		let args = message.content.split(/\s+/);

		// Validate URL.
		if (!this.validateURL(args[1])) {
			// this is not a URL, let's try a search resolve
			args.shift(); // remove the command.
			let searchString = args.join("+"); // create a search string by joining the rest of the strings.

			// Is there a second argument?
			if (!searchString) {
				return message.channel.send(strings.getModuleString("MUSIC", "NO_PLAY_INPUT", message.guild.id)).catch(console.error);
			}

			message.channel.send(strings.getModuleString("MUSIC", "SEARCHING_YOUTUBE", message.guild.id)).catch(console.error);

			// Get video from API.
			youtube
				.searchVideos(searchString, 1)
				.then((res) => {
					// Add the song to the queue.
					this.enqueueSong(res, message, serverQueue, servers);

					// Respond to message.
					message.react("👍").catch(console.error);
					const embed = new Discord.MessageEmbed();
					embed.setDescription(strings.getModuleString("MUSIC", "SONG_ADDED", message.guild.id)).setColor(globals.embed_color);
					return message.channel.send(embed).catch(console.error);
				})
				.catch((err) => {
					console.log("Exception: searchVideo() from API threw an error.");
				});
			return;
		}

		// Rename to url.
		const url = args[1];
		// Instantiate a new embed.
		const embed = new Discord.MessageEmbed();
		// Response from API.
		var res = null;

		// Validate again to tell whether it's a song or a playlist.
		if (!this.validatePlaylistURL(url)) {
			// this is a single song.
			// Get video from  API.
			youtube
				.getVideo(url)
				.then((res) => {
					// Set embed description.
					embed.setDescription(strings.getModuleString("MUSIC", "SONG_ADDED", message.guild.id)).setColor(globals.embed_color);
					// Add the song to the queue.
					this.enqueueSong(res, message, serverQueue, servers);
					// React to message
					message.react("👍").catch(console.error);
					// Send embed.
					message.channel.send(embed).catch(console.error);
				})
				.catch((err) => {
					console.log("Exception: getVideo() from API threw an exception.\n" + err);
				});
		} else {
			// this is a playlist.
			// Get videos from playlist from API.
			youtube
				.getPlaylist(url)
				.then((playlist) => {
					playlist
						.getVideos()
						.then((videos) => {
							// Add the song to the queue.
							this.enqueueSong(videos, message, serverQueue, servers);
							// Set embed description.
							embed
								.setDescription("**" + videos.length + "**" + strings.getModuleString("MUSIC", "SONGS_ADDED", message.guild.id))
								.setColor(globals.embed_color);
							// React to message
							message.react("👍").catch(console.error);
							// Send embed.
							message.channel.send(embed).catch(console.error);
						})
						.catch((err) => {
							console.log("Exception: getVideo() from API threw an exception. (from Playlist)\n" + err);
						});
				})
				.catch((err) => {
					console.log("Exception: getPlaylist() from API threw an exception.\n" + err);
				});
		}
	},

	// enqueue a song or songs.
	enqueueSong(songs, message, serverQueue, servers) {
		// Store the name of the channel.
		const voiceChannel = message.member.voice.channel;

		// If there is no queue associated with this server, create a new one.
		if (!serverQueue) {
			const newQueue = {
				textChannel: message.channel,
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
				volume: 100,
				playing: true,
			};

			// Add the queue to the Map with the corresponding guild ID.
			servers.set(message.guild.id, newQueue);

			// Add the song to the queue.
			newQueue.songs = newQueue.songs.concat(songs);

			// Wait to establish connection with the voice channel.  // join() returns a VoiceConnection object.
			voiceChannel
				.join()
				.then((connection) => {
					connection.voice.setSelfDeaf(true); // Self deaf.
					newQueue.connection = connection; // Store a reference to the connection object.
					this.play(message.guild, newQueue.songs[0], servers); // Play the first song.
				})
				.catch((err) => {
					// if there's an error, clear this server's queue and show the error.
					console.log("Exception: connection to voice channel failed.");
					servers.delete(message.guild.id);
					return message.channel.send(err);
				});
		} else {
			serverQueue.songs = serverQueue.songs.concat(songs);
		}
	},

	// Play a song.
	async play(guild, song, servers) {
		// Look at the map that contains all the music queues from all servers, then look for the server with the guild id from the message.
		const serverQueue = servers.get(guild.id);

		// If there's no songs left, leave the channel and clear this server from the map.
		if (!song) {
			try {
				serverQueue.voiceChannel.leave();
				servers.delete(guild.id);
				serverQueue.connection.disconnect();
				return;
			} catch (err) {
				console.log("Exception: disconnection failed.");
			}
		}

		// Show currently playing.
		const embed = new Discord.MessageEmbed();
		embed.setTitle(strings.getModuleString("MUSIC", "PLAYING_NOW_2", guild.id)).setDescription(song.title).setColor(globals.embed_color).setURL(song.url);
		serverQueue.textChannel.send(embed).catch(console.error);

		// Play the music. When song ends, remove the first song from the queue and play again until there's no more songs.
		var dispatcher = serverQueue.connection // play() returns a StreamDispatcher object. It sends voice packet data to the voice connection
			.play(
				await ytdl(song.url, { highWaterMark: 1 << 25, quality: "highestaudio", filter: "audioonly" }).catch((err) => {
					console.log("ytdl threw an exception\n" + err);
				}),
				{ type: "opus" }
			)
			.on("finish", () => {
				// Remove the first song from the queue.
				serverQueue.songs.shift();
				// Play the next song, if any.
				this.play(guild, serverQueue.songs[0], servers).catch((err) => {
					console.log("Exception when playing next song. Trying to play again.");
					// If failed, try once again.
					setTimeout(() => {
						this.play(guild, serverQueue.songs[0], servers).catch((err) => {
							console.log("Exception when playing next song.");
						});
					}, 3000); //
				});
			})
			.on("error", (error) => console.error(error));

		// Sets the volume to 1.
		dispatcher.setVolume(defaultVolume);
	},

	// VALIDATORS
	validateURL(url) {
		return /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/.test(url);
	},
	validatePlaylistURL(url) {
		return /^.*(youtu.be\/|list=)([^#\&\?]*).*/.test(url);
	},
};
