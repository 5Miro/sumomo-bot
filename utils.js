const { LANG } = require("./globals");

module.exports = {
    getCurrentServer(guild_id) {
        return global.client.servers.get(guild_id);
    },
    getServerLanguageIndex(guild_id) {
        return LANG.indexOf(module.exports.getCurrentServer(guild_id).config.language)
    }
}