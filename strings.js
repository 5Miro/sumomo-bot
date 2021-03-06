const globals = require("./globals");
const { getServerLanguageIndex } = require("./utils");

// Strings in ENGLISH
const LANG_EN = {
	// MUDAE ALARM
	RESET_ROLLS: [
		"-sama! rolls, rolls, rolls have arrived! - *whistles* - ",
		"-sama, get up, get up!, it's time to roll! (^‿^)",
		"-sama, we have to roll, don't miss it! - *tambourine noises* -",
	],
	RESET_CLAIMS: [
		"-sama, heads up! time to claim, let's go! (ง '̀͜ '́ )ง ",
		"-sama! you can claim, you can claim! - *tambourine noises* - ",
		"-sama, let's claim!, let's claim! - *whistles* -",
	],
	SUBSCRIBED: "-sama, you've subscribed to the Mudae Alarm. You will be receiving DMs from Sumomo every time your rolls and claims reset. Yey!",
	UNSUBSCRIBED: "-sama, you are no longer subscribed to the Mudae Alarm. Even so, do not forget to roll and claim!",

	// COMMUNICATION
	MARRIAGE: ["Omedetou, omedetou! ٩(•ᗜ•)٩"],
	DIVORCE: ["welp, that was quick (စ_စ)", "kakeras yeyyy! (≧ ᗜ ≦)", "maybe I can claim it next time! (စ ද စ) ", "that's awful, AWFUL! (╯°□°)╯"],
	SURPRISE: ["What happened? Did I miss something??", "how? what?? where???"],
	GIFT: ["Was that a gift or a trade? (စ ද စ)", "Nothing for Sumomo? T_T", "*suspicion look*"],
	TRADE: ["Opino que fue un trato justo! (^ᗜ^)", "Tradeo, tradeo!, - *silbatazos* -"],
	ABOUT: ["I'm programmed to dance and sing!!! (・ω・)", "Did you know I'm 16cms height? (︶ω︶)"],
	GOOD_MORNING: "*silbatazo* - Ohayou gozaimasu!, wakey wakey! let's do some morning exercises to start the day with the right foot!",
	HELLO: [
		"-sama! okaeri! okaeri! ٩(•ᗜ•)٩ - *tambourine noises* -",
		"-sama, why don't we work out together today? (ง '̀͜ '́ )ง",
		"-sama is back! let's dance and sing! ᕙ(`▽´)ᕗ",
		"-sama, did you know I'm 16cms height? (•ᗜ•)ﾉ",
		"-sama! to start a good day we gotta move our body! (•ᗜ•)ﾉ",
	],

	FRIENDSHIP: [
		"It seems like it doesn't like you.",
		"She's not used to you quite yet.",
		"She's beginning to gain confidence in your presence.",
		"She likes you. She looks so happy!",
		"She fully trusts you. You two are inseparable!",
		"She adores you! There's nothing more to say, how wonderful.",
	],

	SYSTEM: {
		PERMISSION_ERROR: "-sama, you have no permissions to execute this command.",
		AUTHOR: "developed by Miro",
		FOOTER: "Thanks for trusting Sumomo!",
	},

	COMMANDS: {
		CONFIG: {
			EMBED_DESCRIPTION: "Server configuration.",
			EMBED_SUBTITLE: "**Settings:**",
		},
		HELP: {
			EMBED_DESCRIPTION: "Multipurpose bot; Sumomo is optimistic, hyperactive and extra kawaii.",
			EMBED_SUBTITLE: "**Commands:**",
		},
		LANG: {
			SUCCESS: "then I'll speak english (^ᗜ^)",
			ERROR: "Syntax error.\nlang en -> english\nlang es -> español",
		},
		MODULES: {
			EMBED_SUBTITLE: "**Modules:**",
		},
		RESETFS: {
			SUCCESS: "Friendship percents have been reset to the default value (╯°□°)╯",
			ERROR: "Unexpected error in resetfs. Please, contact Miro u.u",
		},
		SETMUDAE: {
			SUCCESS: "Success: Mudae's alarm settings have been updated (︶ω︶)",
			ERROR: "Syntax error.\nExample: setMudae 1 45 3 1 (begins at 1:45, claims every 3 hours, rolls every hour. UTC time zone)",
		},
		SETPREFIX: {
			SUCCESS: "Sumomo's prefix has been updated ٩(•ᗜ•)٩",
			ERROR:
				"Syntax error.\nPrefix must contain a minimum of " +
				globals.PREFIX_MIN_LENGTH +
				"characters and a maximum of " +
				globals.PREFIX_MAX_LENGTH +
				" (•ᗜ•)ﾉ",
		},
	},
	MODULES: {
		FRIENDSHIP: {
			MESSAGE_HEADER: "Your friendship with Sumomo is of ",
		},
		MUSIC: {
			NO_SONGS_IN_QUEUE: "There's no songs in the queue.",
			LOADING_QUEUE: "Loading queue info...",
			QUEUE_LENGTH: " songs in queue.",
			PLAYING_NOW: "- (playing now)",
			PLAYING_NOW_2: "**Playing now**",
			QUEUE_LENGTH_EXCESS: "among other songs. (စ ද စ)",
			NO_VOICE_CHANNEL: "You must be connected to a voice channel to execute this command (╯°□°)╯",
			PAUSED: "Music is now paused.",
			LACK_PERMISSIONS: "I lack the necessary permissions to play music T_T",
			NO_PLAY_INPUT: "You have not written any search criteria or link.",
			SEARCHING_YOUTUBE: "Searching on Youtube...",
			SONG_ADDED: "The song has been added to the queue",
			SONGS_ADDED: " songs added.",
			RESUMED: "Resuming music.",
		},
	},
};

// Strings in SPANISH
const LANG_ES = {
	// MUDAE ALARM
	RESET_ROLLS: [
		"-sama! rolls, rolls, llegaron los rolls! - *silbatazos* - ",
		"-sama, arriba, arriba!, es hora de rollear! (^‿^)",
		"-sama, es momento de rollear, no se lo pierda! - *ruidos de pandereta* -",
	],
	RESET_CLAIMS: [
		"-sama, atención! es hora de claimear, vamos! (ง '̀͜ '́ )ง ",
		"-sama! ya tiene claim, ya tiene claim! - *ruidos de pandereta* - ",
		"-sama, a claimear!, a claimear! - *silbatazos* -",
	],
	SUBSCRIBED: "-sama, se ha suscrito a la alarma de Mudae. Ahora recibirá DMs de Sumomo cuando sus rolls y claims se reseteen. Yey!",
	UNSUBSCRIBED: "-sama, ya no está suscrito a la alarma de Mudae. Aún asi, no olvide rollear y claimear!",

	// COMMUNICATION
	MARRIAGE: ["Omedetou, omedetou! ٩(•ᗜ•)٩"],
	DIVORCE: ["eso fue rápido (စ_စ)", "puntitos wiii! (≧ ᗜ ≦)", "quizás yo pueda claimearlo la proxima vez! (စ ද စ) ", "es terrible, TERRIBLE! (╯°□°)╯"],
	SURPRISE: ["Qué pasó? Me perdí de algo??", "cómo? que pasó qué cosa??"],
	GIFT: ["Fue un regalo o un trade? (စ ද စ)", "Para Sumomo no hay nada? T_T", "*mirada de sospecha*"],
	TRADE: ["Opino que fue un trato justo! (^ᗜ^)", "Tradeo, tradeo!, - *silbatazos* -"],
	ABOUT: ["Estoy programada para bailar y cantar!!! (・ω・)", "Sabias que mido 16 centímetros? (︶ω︶)"],
	GOOD_MORNING: "*silbatazo* - Ohayou gozaimasu!, hagamos ejercicios matutinos para comenzar el día con energías!",
	HELLO: [
		"-sama! okaeri! okaeri! ٩(•ᗜ•)٩ - *panderetazos* -",
		"-sama, por qué no hacemos ejercicio juntos hoy? (ง '̀͜ '́ )ง",
		"-sama volvió! es hora de bailar y cantar! ᕙ(`▽´)ᕗ",
		"-sama, sabía que mido 16 centímetros? (•ᗜ•)ﾉ",
		"-sama! para empezar un buen día hay que mover el esqueleto! (•ᗜ•)ﾉ",
	],

	FRIENDSHIP: [
		"Da la impresión de que no le gustas.",
		"Aún no está acostumbrada a vos.",
		"Comienza a entrar en confianza ante tu presencia.",
		"Le gustas. Se la ve muy feliz!",
		"Confía plenamente en vos. Son inseparables!",
		"Te adora! No hay nada más que decir, qué maravilla.",
	],

	SYSTEM: {
		PERMISSION_ERROR: "-sama, no tiene permisos para ejecutar este comando.",
		AUTHOR: "desarrollado por Miro",
		FOOTER: "Gracias por confiar en Sumomo!",
	},

	COMMANDS: {
		CONFIG: {
			EMBED_DESCRIPTION: "Configuración del servidor.",
			EMBED_SUBTITLE: "**Parámetros:**",
		},
		HELP: {
			EMBED_DESCRIPTION: "Bot multipropósito; Sumomo es optimista, hiperactiva y muy kawaii.",
			EMBED_SUBTITLE: "**Comandos:**",
		},
		LANG: {
			SUCCESS: "entonces hablaré español (^ᗜ^)",
			ERROR: "Error de sintáxis:\nlang en -> english\nlang es -> español",
		},
		MODULES: {
			EMBED_SUBTITLE: "**Módulos:**",
		},
		RESETFS: {
			SUCCESS: "Los % de amistad han sido reseteados al valor inicial (╯°□°)╯",
			ERROR: "Error inesperado en resetfs. Por favor, contacte a Miro u.u",
		},
		SETMUDAE: {
			SUCCESS: "Éxito: la configuración de la alarma de Mudae ha sido actualizada (︶ω︶)",
			ERROR: "Error de sintáxis.\nEj: setMudae 1 45 3 1 (Empieza a las 1:45, los claims son cada 3 horas, los rolls cada 1 hora. Zona horaria UTC)",
		},
		SETPREFIX: {
			SUCCESS: "El prefijo de Sumomo ha sido actualizado ٩(•ᗜ•)٩",
			ERROR:
				"Error de sintáxis.\nEl prefijo debe tener un mínimo de" +
				globals.PREFIX_MIN_LENGTH +
				"caracteres y un máximo de " +
				globals.PREFIX_MAX_LENGTH +
				" (•ᗜ•)ﾉ",
		},
	},
	MODULES: {
		FRIENDSHIP: {
			MESSAGE_HEADER: "Tu amistad con Sumomo es del ",
		},
		MUSIC: {
			NO_SONGS_IN_QUEUE: "No hay canciones en la cola de reproducción.",
			LOADING_QUEUE: "Cargando información sobre la cola de reproducción...",
			QUEUE_LENGTH: " canciones en la cola.",
			PLAYING_NOW: "- (sonando ahora)",
			PLAYING_NOW_2: "**Sonando ahora**",
			QUEUE_LENGTH_EXCESS: "entre otras canciones más. (စ ද စ)",
			NO_VOICE_CHANNEL: "Debes estar en un canal de voz para ejecutar este comando (╯°□°)╯",
			PAUSED: "Reproducción pausada.",
			LACK_PERMISSIONS: "Me faltan permisos para tocar mi música T_T",
			NO_PLAY_INPUT: "No has escrito ningún criterio de búsqueda o link.",
			SEARCHING_YOUTUBE: "Buscando en Youtube...",
			SONG_ADDED: "La canción ha sido agregada a la cola.",
			SONGS_ADDED: " canciones han sido agregadas.",
			RESUMED: "Continuando reproducción.",
		},
	},
};

// STRING LIBRARY
const STRINGS_LIBRARY = [LANG_EN, LANG_ES];

module.exports = {
	getRandomString(string, guild_id) {
		/**
		 * Gets STRINGS from a specific language passing an index that corresponds to the server's language config. After that, get a random string from that category.
		 */
		return STRINGS_LIBRARY[getServerLanguageIndex(guild_id)][string][
			Math.floor(Math.random() * STRINGS_LIBRARY[getServerLanguageIndex(guild_id)][string].length)
		];
	},
	getString(string, guild_id, i) {
		if (i) {
			return STRINGS_LIBRARY[getServerLanguageIndex(guild_id)][string][i];
		} else {
			return STRINGS_LIBRARY[getServerLanguageIndex(guild_id)][string];
		}
	},
	getRandomGif(string) {
		return GIFS[string][Math.floor(Math.random() * GIFS[string].length)];
	},
	getGif(string, i) {
		return GIFS[string][i];
	},
	getSystemString(string, guild_id) {
		return STRINGS_LIBRARY[getServerLanguageIndex(guild_id)]["SYSTEM"][string];
	},
	getCommandString(command, string, guild_id) {
		return STRINGS_LIBRARY[getServerLanguageIndex(guild_id)]["COMMANDS"][command][string];
	},
	getModuleString(module, string, guild_id) {
		return STRINGS_LIBRARY[getServerLanguageIndex(guild_id)]["MODULES"][module][string];
	},
};

// GIFS
const GIFS = {
	DANCE: [
		"https://tenor.com/view/sumomo-chobits-anime-wakey-wakey-plum-gif-15044233",
		"https://j.gifs.com/q7Njn0.gif",
		"https://j.gifs.com/xnXqZr.gif",
		"https://j.gifs.com/OM4lOp.gif",
		"https://j.gifs.com/nxKZj7.gif",
		"https://j.gifs.com/WL4nRx.gif",
	],
	FRIENDSHIP: [
		"https://j.gifs.com/2xV46K.gif",
		"https://j.gifs.com/5QYLmZ.gif",
		"https://j.gifs.com/oVLyMN.gif",
		"https://j.gifs.com/2xVRN1.gif",
		"https://j.gifs.com/oVLREj.gif",
		"https://j.gifs.com/yoYX0w.gif",
	],
};
