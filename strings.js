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
		AFFIRMATIVE: "y",
		NEGATIVE: "n",
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
		CALENDAR: {
			CALENDAR_ASCII: `
┌────────────────────┐
│ /month      / year │
├──┬──┬──┬──┬──┬──┬──┤
│Su│Mo│Tu│We│Th│Fr│Sa│
├──┼──┼──┼──┼──┼──┼──┤
│00│01│02│03│04│05│06│
├──┼──┼──┼──┼──┼──┼──┤
│07│08│09│10│11│12│13│
├──┼──┼──┼──┼──┼──┼──┤
│14│15│16│17│18│19│20│
├──┼──┼──┼──┼──┼──┼──┤
│21│22│23│24│25│26│27│
├──┼──┼──┼──┼──┼──┼──┤
│28│29│30│31│32│33│34│
├──┼──┼──┼──┼──┼──┼──┤
│35│36│37│38│39│40│41│
└──┴──┴──┴──┴──┴──┴──┘`,
			MONTHS: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			UPCOMING_EVENTS_TITLE: "٩(•ᗜ•)٩ these are the upcoming events:",
			TODAY_TEXT: "TODAY!!",
			TODAY_IS: "Today is ",
			EVENT_ADDED_SUCCESS: "Understood! I'll add it to the calendar (^ᗜ^)",
			HELP:
				"Use |calendarNew dd/mm/YYYY [description] to add an event.\nIf you skip the year, current year will be used as default\n\nFor annual events, use |calendarNew repeat dd/mm/YYYY [description]\nAnnual events will be rescheduled automatically!\n\nExample 1: |calendarNew repeat 23/10/2021 Sumomo's birthday\nExample 2: |calendarNew 5/2/2021 top-secret meeting\n\nUse |calendarChannel [text-channel ID] so Sumomo can remind of upcoming events daily on that text-channel.\n\nUse |calendarCheck [days] to see the upcoming events in the following [days]. If you skip the [days] value, this will be 15 by default.",
			ERROR: {
				NEW_SYNTAX_ERROR: "Syntax error. Use |calendarHelp for more info",
				NEW_OLD_DATE_ERROR: "Input date is older than current date o.o",
				TIME_ZONE_ERROR: "Error: timezone must be set from -12 to 12. If you are outside this range, contact Miro",
			},
			CHANNEL_ID_SET: "Calendar's text-channel ID has been set succesfully (^ᗜ^)",
			TIME_ZONE_SET: "Calendar's timezone has been updated succesfully (^ᗜ^)",
		},
		MOMOCOINS: {
			GAIN_COINS: " obtained ",
			SPEND_COINS: " spent ",
			CURRENT_COINS: ", you have ",
			NOT_ENOUGH_COINS: ", you don't have enough Momocoins for that (စ_စ)",
		},
		DAEMON_DICE: {
			VICTORY: " and claimed his glory!",
			VICTORY_AND_ITEM: " and claimed his glory!\nYour hero also found a ",
			NOT_ENOUGH_ROOM_FOR_ITEM:
				"\nYour hero had no space left to equip it so it was put in the bag. Use '|ddReplaceItem [slot]' to replace and old item in [slot] for the new item.",
			RIP: "R.I.P.",
			DEFEAT: " and met his/her final fate.",
			DEFEAT_BY_DEATH: " faced Death Itself and met his/her final fate.",
			HERO_STATUS: {
				GLORY: "GLORY ",
				LEGEND: "LEGEND",
				IN_PARTY_WITH: "Party members:",
				SLOT: "Slot ",
				EQUIPMENT: "Equipment					-",
				ACHIEVEMENTS: "Achievements					-",
				TOTAL_CHANCE: "Total chance of survival: **",
				BASE_CHANCE: "\n- Base chance: ",
				DD_MODIFIER: "\n- Daemon Dice modifier: ",
				ITEM_MODIFIER: "\n- Item modifier: ",
				PARTY_MODIFIER: "\n- Party modifier: ",
				FOOTER_DEAD: "R.I.P.		(T_T)",
				FOOTER_LEGEND: "Retired		 (^ᗜ^)",
			},
			THE_END: {
				PART_1: "Unbelievable!, ",
				PART_2: " has cheated Death Itself.\n\n<@",
				PART_3:
					">, your hero has become a living **LEGEND**✨.\n\nYou wave goodbye to your friend, now retired and with his/her thirst for Glory finally sated.\n\nTurns out there was more to Life than glory on Death.\n\n**THE END**",
			},
			CHANNEL_UPDATED: "Daemon Dice text-channel ID has been set succesfully (^ᗜ^)",
			ERROR: {
				NO_NAME: "Your hero must have a name! ᕙ(`▽´)ᕗ",
			},
			NEW_HERO: {
				PART_1: ": a new hero named ",
				PART_2: " has been assigned to your care.",
			},
			ROLLED_DICE: " rolled a ",
			DICE_LEFT: "\nExtra rolls left: ",
			NO_DICE_LEFT:
				", you have no rolls left. You can roll up to " + globals.ROLLS_PER_QUEST + " dice per quest. A new roll overwrites your previous result.",
			NO_HERO: ", you have no hero assigned! ᕙ(`▽´)ᕗ",
			ROLL_COST: "The cost of rolling the Daemon Dice again is ",
			PARTY: {
				NO_TAG_ERROR: ", you must tag the user with whom you want to form a party with! ᕙ(`▽´)ᕗ",
				SELF_PARTY_ERROR: ", you cannot invite yourself to a party! (စ ද စ)",
				HERO_UNAVAILABLE: ", your hero cannot continue the adventure. You need a new one",
				FULL_PARTY: ", your party is full!",
				ALREADY_IN_PARTY: ", you are already in a party with that user (စ_စ)",
				TIMEOUT: ", time is out. Your invitation wasn't answered",
				DECLINED: ", user declined your invitation. Respectfully, of course (စ ද စ)",
				ACCEPTED: " are now in a party! (ง '̀͜ '́ )ง",
			},
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
		AFFIRMATIVE: "s",
		NEGATIVE: "n",
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
		CALENDAR: {
			CALENDAR_ASCII: `
┌────────────────────┐
│ /month      / year │
├──┬──┬──┬──┬──┬──┬──┤
│Do│Lu│Ma│Mi│Ju│Vi│Sa│
├──┼──┼──┼──┼──┼──┼──┤
│00│01│02│03│04│05│06│
├──┼──┼──┼──┼──┼──┼──┤
│07│08│09│10│11│12│13│
├──┼──┼──┼──┼──┼──┼──┤
│14│15│16│17│18│19│20│
├──┼──┼──┼──┼──┼──┼──┤
│21│22│23│24│25│26│27│
├──┼──┼──┼──┼──┼──┼──┤
│28│29│30│31│32│33│34│
├──┼──┼──┼──┼──┼──┼──┤
│35│36│37│38│39│40│41│
└──┴──┴──┴──┴──┴──┴──┘`,
			MONTHS: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
			UPCOMING_EVENTS_TITLE: "٩(•ᗜ•)٩ estos son los eventos venideros:",
			TODAY_TEXT: "HOY!!",
			TODAY_IS: "Hoy es ",
			EVENT_ADDED_SUCCESS: "Entendido! Lo agregaré al calendario (^ᗜ^)",
			HELP:
				"Utiliza |calendarNew dd/mm/AAAA [descripción] para agregar un evento.\nSi omites el año, se usará el año actual por defecto.\n\nPara eventos anuales, utiliza |calendarNew repeat dd/mm/AAAA [descripción]\nEl evento se renovará cada año automáticamente!\n\nEjemplo 1: |calendarNew repeat 23/10/2021 cumpleaños de Sumomo\nEjemplo 2: |calendarNew 5/2/2021 reunión ultrasecreta\n\nUsa |calendarChannel [ID de canal de texto] para que Sumomo envíe los recordatorios diarios en ese canal de texto.\n\nUtiliza |calendarCheck [dias] para ver los eventos en los próximos [dias]. Si omites el valor de [dias], este será 15 por defecto.",
			ERROR: {
				NEW_SYNTAX_ERROR: "Error de sintaxis. Ingresa |calendarHelp para más info",
				NEW_OLD_DATE_ERROR: "La fecha ingresada es anterior a la fecha actual o.o",
				TIME_ZONE_ERROR: "Error: la zona horaria debe ser de -12 a 12. Si estás fuera de este rango, contacta con Miro",
			},
			CHANNEL_ID_SET: "El ID del canal de texto para el calendario se ha configurado con éxito (^ᗜ^)",
			TIME_ZONE_SET: "La zona horaria del calendario ha sido actualiza con éxito (^ᗜ^)",
		},
		MOMOCOINS: {
			GAIN_COINS: " obtuvo ",
			SPEND_COINS: " gastó ",
			CURRENT_COINS: ", tienes ",
			NOT_ENOUGH_COINS: ", no tienes suficientes Momocoins para eso (စ_စ)",
		},
		DAEMON_DICE: {
			VICTORY: " y reclamó su gloria!",
			VICTORY_AND_ITEM: " y reclamó su gloria!\nTu héroe también encontró un/a ",
			NOT_ENOUGH_ROOM_FOR_ITEM:
				"\nTu héroe no tenía espacio para equipar el objeto, por lo que lo puso en su mochila. Usa '|ddReplaceItem [slot]' para reemplazar un objeto viejo en [slot] por el nuevo objeto.",
			RIP: "R.I.P.",
			DEFEAT: " y encontró su destino final.",
			DEFEAT_BY_DEATH: " se enfrentó a la Muerte en persona y encontró su destino final.",
			HERO_STATUS: {
				GLORY: "GLORIA ",
				LEGEND: "LEYENDA",
				IN_PARTY_WITH: "Miembros del grupo:",
				SLOT: "Espacio ",
				EQUIPMENT: "Equipamiento					-",
				ACHIEVEMENTS: "Logros 					-",
				TOTAL_CHANCE: "Chance total de supervivencia: **",
				BASE_CHANCE: "\n- Chance base: ",
				DD_MODIFIER: "\n- Modificador de Daemon Dice: ",
				ITEM_MODIFIER: "\n- Modificador de objetos: ",
				PARTY_MODIFIER: "\n- Modificador de grupo: ",
				FOOTER_DEAD: "R.I.P.		(T_T)",
				FOOTER_LEGEND: "Retirado		 (^ᗜ^)",
			},
			THE_END: {
				PART_1: "Increíble!, ",
				PART_2: " ha engañado a la Muerte en persona.\n\n<@",
				PART_3:
					">, tu héroe se ha convertido en una **LEYENDA**✨ viviente.\n\nTe despides de tu amigo, ahora retirado/a y con su sed de Gloria finalmente saciada.\n\nResulta que había más en la vida que Gloria en la Muerte.\n\n**EL FIN**",
			},
			CHANNEL_UPDATED: "El canal de texto de Daemon Dice se ha configurado con éxito (^ᗜ^)",
			ERROR: {
				NO_NAME: "Tu héroe debe tener un nombre! ᕙ(`▽´)ᕗ",
			},
			NEW_HERO: {
				PART_1: ": un nuevo héroe llamado ",
				PART_2: " ha sido asignado a tu cuidado.",
			},
			ROLLED_DICE: " ha tirado un ",
			DICE_LEFT: "\nTiradas extra restantes: ",
			NO_DICE_LEFT:
				", no te quedan tiradas. Puedes tirar hasta " +
				globals.ROLLS_PER_QUEST +
				" dados por aventura. Una nueva tirada sobreescribe a la tirada anterior.",
			NO_HERO: ", no tienes un héroe asignado! ᕙ(`▽´)ᕗ",
			ROLL_COST: "Tirar de nuevo el dado Daemon cuesta ",
			PARTY: {
				NO_TAG_ERROR: ", debes etiquetar al usuario con el que quieres formar un grupo! ᕙ(`▽´)ᕗ",
				SELF_PARTY_ERROR: ", no puedes invitarte a ti mismo a un grupo! (စ ද စ)",
				HERO_UNAVAILABLE: ", tu héroe no está disponible para la aventura. Necesitas uno nuevo",
				FULL_PARTY: ", tu grupo está lleno!",
				ALREADY_IN_PARTY: ", ya te encuentras en un grupo con ese usuario (စ_စ)",
				TIMEOUT: ", se terminó el tiempo. Tu invitación no fue contestada",
				DECLINED: ", el usuario declinó tu invitación. Respetuosamente, claro (စ ද စ)",
				ACCEPTED: " han formado un grupo de Daemon Dice! (ง '̀͜ '́ )ง",
			},
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
		if (i || i === 0) {
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
