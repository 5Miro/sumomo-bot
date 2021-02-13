const serverQueues = new Map() // A map that stores servers's queues. They key that identifies the server is the guild ID

module.exports = {
    name: "music",
    isActivated: true,
    descrip: [
        "Sumomo plays music from Youtube",
        "Sumomo reproduce música de Youtube."
    ],
    OnInterval() {
        // This function will be called periodically.

    },
    OnMessage(message) {
        // This function will be called when a message is read.


    },
    OnVoiceStateUpdate(oldState, newState) {

    },

    getQueues() {
        return serverQueues;
    }
}