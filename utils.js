module.exports = {
    getCurrentServer(guild_id) {
        return global.client.servers.get(guild_id);
    }
}