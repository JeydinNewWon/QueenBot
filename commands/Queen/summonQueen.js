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
 * Created by JeydinNewWon on 05/01/18.
 */

const discord = require('discord.js');
const jsonfile = require('jsonfile');
const path = require('path');
const titleCase = require('titlecase');
const fileExists = require('file-exists');
const logger = require('../../utils/logger.js');
const config = require('../../config/config.json');
const fail = config.fail_command_emoji;
const commandPrefix = config.bot_command_prefix;
const name = "queen";
const mod = "Queen";
const command = `${commandPrefix}${name}`;
const usage = `\`${command} {nameofqueen}\``;
const description = "Summons a random queen. If argument is supplied, a queen search is attempted.";

function execute(msg) {
    var args = msg.content.split(' ')[1];
    var guildId = msg.guild.id;
    var pathToQueen = path.join(__dirname, `../../data/queens/${guildId}.json`);

    if (!fileExists.sync(pathToQueen)) {
        msg.channel.send(`${fail} There are no registered queens for this server. Add queens with \`${commandPrefix}addqueen\`.`);
        logger.warn(`${command}: ${pathToQueen} does not exist.`);
        return;
    }

    if (!args || args.length === 0) {
        jsonfile.readFile(pathToQueen, (err, obj) => {
            var objKeys = [];

            Object.keys(obj).forEach((key) => {
                var tempImgList = obj[key];

                if (tempImgList.length > 0) {
                    objKeys.push(tempImgList);
                }
            });

            if (objKeys.length === 0) {
                msg.channel.send(`${fail} There are no registered queens for this server. Add queens with \`${commandPrefix}addqueen\`.`);
                logger.warn(`${command}: No queens were registered in ${pathToQueen}.`);
                return;
            }

            var randomKey = objKeys[Math.floor(Math.random() * objKeys.length)];
            var randomList = obj[randomKey];
            var randomValue = randomList[Math.floor(Math.random() * randomList.length)];

            var embed = new discord.RichEmbed()
                .setColor('GREEN')
                .setTitle(titleCase(randomKey))
                .setImage(randomValue);

            msg.channel.send({
                embed: embed
            }).then((message) => {
                logger.info(`${command}: Sent queen ${titleCase(randomKey)}`);
                return;
            });

        }); 

    } else {
        jsonfile.readFile(pathToQueen, (err, obj) => {

            if (Object.keys(obj).length === 0) {
                msg.channel.send(`${fail} There are no registered queens for this server. Add queens with \`${commandPrefix}addqueen\`.`);
                logger.warn(`${command}: No queens were registered in ${pathToQueen}.`);
                return;
            }

            var queenList = obj[args.toLowerCase()];

            if (!queenList) {
                msg.channel.send(`${fail} Requested queen was not found!`);
                logger.warn(`${command}: Queen "${args}" was not found.`);
                return;
            } else if (queenList.length === 0) {
                msg.channel.send(`${fail} No data for requested queen.`);
                logger.warn(`${command}: No data in Queen "${args}"`);
                return;
            }

            var queen = queenList[Math.floor(Math.random() * queenList.length)];

            var embed = new discord.RichEmbed()
                .setColor('GOLD')
                .setTitle(titleCase(args))
                .setImage(queen);
            
            msg.channel.send({
                embed: embed
            }).then((message) => {
                logger.info(`${command} Sent queen ${titleCase(args)}`);
            });

            return;
        });
    }
}

module.exports = {
    "name": name,
    "module": mod,
    "usage": usage,
    "description": description,
    "execute": execute
};