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
const fileExists = require('file-exists');
const titleCase = require('titlecase');
const config = require('../../config/config.json');
const logger = require('../../utils/logger.js');
const commandPrefix = config.bot_command_prefix;
const success = config.success_command_emoji;
const fail = config.fail_command_emoji;
const name = 'removequeen';
const mod = 'Queen';
const command = `${commandPrefix}${name}`;
const usage = `\`${command} [queenname]\``;
const description = "Removes a queen from a server's queen data.";

function execute(msg) {
    var args = msg.content.split(' ')[1];
    var guildId = msg.guild.id;
    var pathToQueen = path.join(__dirname, `../../data/queens/${guildId}.json`);

    if (!fileExists.sync(pathToQueen)) {
        msg.channel.send(`${fail} There are no registered queens for this server. Add queens with \`${commandPrefix}addqueen\`.`);
        logger.warn(`${command}: ${pathToQueen} does not exist.`);
        return;
    }

    if (args) {
        jsonfile.readFile(pathToQueen, (err, obj) => {

            if (Object.keys(obj).length === 0) {
                msg.channel.send(`${fail} There are no registered queens for this server. Add queens with \`${commandPrefix}addqueen\`.`);
                logger.warn(`${command}: No queens were registered in ${pathToQueen}.`);
                return;
            }

            var imgList = obj[args.toLowerCase()];

            if (!imgList) {
                msg.channel.send(`${fail} Requested queen was not found!`);
                logger.warn(`${command}: Queen "${args}" was not found.`);
                return;
            } 

            delete obj[args.toLowerCase()];
            
            jsonfile.writeFile(pathToQueen, obj, {
                spaces: 4
            }, (err) => {
                if (err) {
                    logger.error(`${command}: ${err.name}: ${err.message}`);
                    return;
                }
            });

            msg.channel.send(`${success} Removed queen **${titleCase(args)}**.`).then((message) => {
                logger.info(`${command}: Removed queen ${args}`);
                return;
            });

        });
        
    } else {
        msg.channel.send(`${fail} No arguments were given.`);
        logger.warn(`${command}: No arguments were given.`);
        return;
    }

}

module.exports = {
    "name": name,
    "module": mod,
    "usage": usage,
    "description": description,
    "execute": execute
};