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

const jsonfile = require('jsonfile');
const path = require('path');
const fileExists = require('file-exists');
const titleCase = require('titlecase');
const config = require('../../config/config.json');
const logger = require('../../utils/logger.js');
const commandPrefix = config.bot_command_prefix;
const success = config.success_command_emoji;
const fail = config.fail_command_emoji;
const name = 'addqueen';
const mod = 'Queen';
const command = `${commandPrefix}${name}`;
const usage = `\`${command} [Queen Name] [URL of Image]\` OR \`${command} [Queen Name] [Image Attached to Message]\``;
const description = "Adds a Queen to your server's Queen List.";

function execute(msg) {
    var attachments = msg.attachments;
    var authorUserName = msg.author.username;
    var guildId = msg.guild.id;
    var queenJsonPath = path.join(__dirname, `../../data/queens/${guildId}.json`);
    var args = msg.content.split(' ');
    args.shift();
    if (args) {
        if (args.length === 1) {
            var queenName = args[0].toLowerCase();
            if (queenName.includes('.png') || queenName.includes('.jpg') || queenName.includes('.jpeg')) {
                msg.channel.send(`${fail} When attaching an image with this command, please supply a name of the Queen.`).then((message) => {
                    logger.warn(`${command}: Incorrect arguments in server: ${guildId}.`);
                    return;
                });
            }

            if (attachments.size > 0) {
                var url = attachments.array()[0].url;
                if (!url.toLowerCase().includes('.png') && !url.toLowerCase().includes('.jpg') && !url.toLowerCase().includes('.jpeg')) {
                    msg.channel.send(`${fail} Attachment must be an image.`).then((message) => {
                        logger.warn(`${command}: ${authorUserName} attached an invalid attachment.`);
                        return;
                    });

                } else {
                    var queenServerJsonExists = fileExists.sync(queenJsonPath);
                    if (!queenServerJsonExists) {
                        var obj = {};
                        obj[queenName.toLowerCase()] = [url];

                        jsonfile.writeFile(queenJsonPath, obj, {
                            spaces: 4
                        }, (err) => {
                            if (err) {
                                logger.error(`${command}: ${err.name}: ${err.message}`);
                                return;
                            }
                        });

                        msg.channel.send(`${success} Successfully added **${titleCase(queenName)}**.`).then((message) => {
                            logger.info(`${command}: Added ${queenName.toLowerCase()} to ${queenJsonPath}.`);
                        });

                        return;

                    } else {
                        jsonfile.readFile(queenJsonPath, (err, obj) => {
                            var imgList = obj[queenName.toLowerCase()];

                            if (!imgList) {
                                obj[queenName.toLowerCase()] = [url];
                            } else {
                                obj[queenName.toLowerCase()].push(url);
                            }

                            jsonfile.writeFile(queenJsonPath, obj, {
                                spaces: 4
                            }, (err) => {
                                if (err) {
                                    logger.error(`${command}: ${err.name}: ${err.message}`);
                                    return;
                                }
                            });

                            msg.channel.send(`${success} Successfully added **${titleCase(queenName)}**.`).then((message) => {
                                logger.info(`${command}: Added ${queenName.toLowerCase()} to ${queenJsonPath}.`);
                                return;
                            });

                        });
                    }
                }

            } else {
                msg.channel.send(`${fail} Please attach an image of the Queen.`);
                logger.warn(`${command}: Unattached image in server: ${guildId}.`);
                return;
            }

        } else if (args.length === 2) {
            var queenName = args[0];
            var url = args[1];

            if (!url.toLowerCase().includes('.png') && !url.toLowerCase().includes('.jpg') && !url.toLowerCase().includes('.jpeg') ) {
                msg.channel.send(`${fail} Invalid URL.`).then((message) => {
                    logger.warn(`${command}: Invalid URL in ${message.guild.name}`);
                });
                return;
            }

            var queenServerJsonExists = fileExists.sync(queenJsonPath);
            if (!queenServerJsonExists) {
                var obj = {};
                obj[queenName.toLowerCase()] = [url];

                jsonfile.writeFile(queenJsonPath, obj, {
                    spaces: 4
                }, (err) => {
                    if (err) {
                        logger.error(`${command}: ${err.name}: ${err.message}`);
                        return;
                    }
                });

                msg.channel.send(`${success} Successfully added **${titleCase(queenName)}**.`).then((message) => {
                    logger.info(`${command}: Added ${queenName.toLowerCase()} to ${queenJsonPath}.`);
                });

            } else {
                jsonfile.readFile(queenJsonPath, (err, obj) => {
                    var imgList = obj[queenName.toLowerCase()];

                    if (!imgList) {
                        obj[queenName.toLowerCase()] = [url];
                    } else {
                        obj[queenName.toLowerCase()].push(url);
                    }

                    jsonfile.writeFile(queenJsonPath, obj, {
                        spaces: 4
                    }, (err) => {
                        if (err) {
                            logger.error(`${command}: ${err.name}: ${err.message}`);
                            return;
                        }
                    });

                    msg.channel.send(`${success} Successfully added **${titleCase(queenName)}**.`).then((message) => {
                        logger.info(`${command}: Added ${queenName.toLowerCase()} to ${queenJsonPath}.`);
                        return;
                    });
                    
                });
            }

        } else {
            msg.channel.send(`${fail} Invalid number of arguments entered.`).then((message) => {
                logger.warn(`${command}: Incorrect number of arguments in server: ${guildId}`);
                return;
            });

        }

    } else {
        msg.channel.send(`${fail} No critical arguments given.`).then((message) => {
            logger.warn(`${command}: No critical arguments given in server: ${guildId}`);
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