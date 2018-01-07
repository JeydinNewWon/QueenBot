/*
    Copyright 2018 github.com/JeydinNewWon/

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

/**
 * Created by JeydinNewWon on 04/01/18.
 */

const discord = require('discord.js');
const bot = new discord.Client();
const logger = require('./utils/logger.js');
const CMD = require('./utils/commandHandler.js');

const config = require('./config/config.json');
const botToken = config.bot_token;
const commandPrefix = config.bot_command_prefix;

const cleverBotUser = config.cleverbot_user;
const cleverBotKey = config.cleverbot_key;
const cleverBotModule = require('cleverbot.io');
const cleverBot = cleverBotModule(cleverBotUser, cleverBotKey);

logger.info("Attempting to login...");
bot.login(botToken).then((client) => {
    logger.info("Successfully logged into Discord.");
    logger.info(`Logged in as ${bot.user.username}#${bot.user.discriminator}. ID: ${bot.user.id}`);
});

logger.info("Finished Initialisation.");

bot.on("ready", () => {
    bot.user.setStatus("online").then(() => {
        logger.info("Set bot status to online");
    });

    bot.user.setGame(`Type ${commandPrefix}help for help.`).then(() => {
        logger.info("Set bot playing status.");
    });

    logger.info("Attempting to load commands...");
    CMD.init();
});

bot.on("message", (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith(commandPrefix)) {
        message.botUser = bot;
        message.prefix = commandPrefix;
        CMD.checkCommand(message);
    }
});

bot.on("error", (error) => {
    winston.error(`Bot encountered an error.\n${error.name}: ${error.prototype.message}`);
});

