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
 * Created by JeydinNewWon on 15/01/18.
 */

const discord = require('discord.js');
const jsonfile = require('jsonfile');
const path = require('path');
const titleCase = require('titlecase');
const fileExists = require('file-exists');
const logger = require('../../utils/logger.js');
const config = require('../../config/config.json');
const success = config.success_command_emoji;
const fail = config.fail_command_emoji;
const commandPrefix = config.bot_command_prefix;
const ownerID = config.owner_id;
const name = "clearallqueens";
const mod = "Queen";
const command = `${commandPrefix}${name}`;
const usage = `\`${command}\``;
const description = "Removes all queen data within a server.";

function execute(msg) {
    var guildId = msg.guild.id;
    var pathToQueen = path.join(__dirname, `../../data/queens/${guildId}.json`);

    if (!fileExists.sync(pathToQueen)) {
        msg.channel.send(`${fail} There are no registered queens for this server. Add queens with \`${commandPrefix}addqueen\`.`);
        logger.warn(`${command}: ${pathToQueen} does not exist.`);
        return;
    }

    if (!(msg.member.hasPermission('MANAGE_GUILD', true, true)) && msg.member.id !== ownerID) {
        msg.channel.send(`${fail} You are not permitted to use that command. This command requires \`Manage Server\` permission.`);
        logger.warn(`${command}: ${msg.member.user.tag} permissions denied.`);
        return;
    }

    msg.channel.send("Warning. You are about to delete all Queen data for this server. Please answer with **confirm** in the next `10 seconds` to confirm queen data deletion.").then((message) => {
        message.channel.awaitMessages(m => m.content === 'confirm' && m.author === msg.author, {
            max: 1,
            time: 10000,
            errors: ['time']
        })
            .then((confirmMessage) => {
                var message = confirmMessage.first();
                var clearedObj = {};

                jsonfile.writeFile(pathToQueen, clearedObj, { 
                    spaces: 4
                }, (err) => {
                    if (err) {
                        logger.error(`${command}: ${err.name}: ${err.message}`);
                        return;
                    }
                });

                message.channel.send(`${success} Successfully removed all queens from **${message.guild.name}**.`).then((message) => {
                    logger.info(`${command}: Removed all queen data in ${message.guild.name}: ${guildId}.`);
                    return;
                });

            })
            .catch((cancelledMessage) => {
                message.channel.send("Cancelled clear queens operation.").then((message) => {
                    logger.info(`${command}: Attempt to delete queen data cancelled in ${message.guild.name}: ${guildId}.`);
                    return;
                });
            });

    });
}

module.exports = {
    "name": name,
    "module": mod,
    "usage": usage,
    "description": description,
    "execute": execute
};
