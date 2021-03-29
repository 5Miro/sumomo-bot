const { LANG } = require("./globals");

module.exports = {
	getCurrentServer(guild_id) {
		return global.client.servers.get(guild_id);
	},
	
	getServerLanguageIndex(guild_id) {
		return LANG.indexOf(module.exports.getCurrentServer(guild_id).config.language);
	},

	encryptObject(data) {
		return CryptoJS.AES.encrypt(JSON.stringify(data), process.env.CRYPTO_KEY).toString();
	},

	decryptObject(encryptedData) {
		var bytes = CryptoJS.AES.decrypt(encryptedData, process.env.CRYPTO_KEY);
		return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
	},
};
