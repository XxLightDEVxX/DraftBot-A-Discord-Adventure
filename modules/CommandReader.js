const Config = require('./utils/Config');
const ServerManager = require('./classes/ServerManager');
const CommandTable = require('./CommandTable');
const Text = require('./text/Francais');

class CommandReader {
    constructor() {
        this.serverManager = new ServerManager();
    }

    /**
     * This function analyses the passed message and calls the associated function if there is one.
     * @param {*} message - A command posted by an user.
     * @param {*} client - The bot user in case we have to make him do things
     */
    async handleMessage(message, client) {
        let serverPrefix = await this.serverManager.getServerPrefix(message);
        let prefix = CommandReader.getUsedPrefix(message);
        if (prefix == serverPrefix) {
            launchCommand(message, client);
        } else {
            if (prefix == Config.BOT_OWNER_PREFIX && message.author.id == Config.BOT_OWNER_ID) {
                launchCommand(message, client);
            }
        }

    }

    /**
     * Sanitizes the string and return the command. The command should always be the 1st argument.
     * @param {*} message - The message to extract the command from.
     * @returns {String} - The command, extracted from the message.
     */
    static getCommandFromMessage(message) {
        return CommandReader.getArgsFromMessage(message).shift().toLowerCase();
    }

    /**
     * Sanitizes the string and return the args. The 1st argument is not an args.
     * @param {*} message - The message to extract the command from.
     * @returns {string} - args, extracted from the message.
     */
    static getArgsFromMessage(message) {
        return message.content.slice(Config.PREFIXLENGTH).trim().split(/ +/g);
    }
    /**
     * Get the prefix that the user just used to make the command
     * @param {*} message - The message to extract the command from.
     */
    static getUsedPrefix(message) {
        return message.content.substr(0, 1);
    }
}

/**
 * 
 * @param {*} message - A command posted by an user.
 * @param {*} client - The bot user in case we have to make him do things
 */
function launchCommand(message, client) {
    console.log(`${message.author.username} passed ${message.content}\n`);
    let command = CommandReader.getCommandFromMessage(message);
    let args = CommandReader.getArgsFromMessage(message);
    if (CommandTable.has(command))
        if (!message.channel.permissionsFor(client.user).serialize().SEND_MESSAGES) {
            message.author.send(Text.error.noSpeakPermission);
        } else {
            CommandTable.get(command)(message, args, client);
        }
}

module.exports = CommandReader;




