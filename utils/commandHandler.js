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

var commands = {};
const modules = ["Queen"];
const config = require('../config/config.json');
const fail = config.fail_command_emoji;
const fs = require('fs');
const path = require('path');
const logger = require('./logger.js');

function loadCommands() {
    fs.readdir(path.join(__dirname, '../commands'), (err, modules) => {
        for (var module of modules) {
            // Mac OS X garbage
            if (module === ".DS_Store") continue;

            fs.readdir(path.join(__dirname, `../commands/${module}`), (err, files) => {
                for (var file of files) {
                    if (file.endsWith('.js')) {
                        var command = require(path.join(__dirname, `../commands/${module}/${file}`));
                        commands[command.name] = command;
                    }
                }
            });
        }
    });

    logger.info(`Loaded commands ${Object.keys(commands).join(', ')}`);
    saveCommands(commands);
}

function saveCommands(t) {
    commands = t;
}

function checkCommand(msg) {
    try {
        var commandName = msg.content.substr(msg.prefix.length).split(' ')[0];
        var command = commands[commandName];

        if (!command) {
            msg.channel.send(`${fail} Sorry, that command is invalid.`);
            return;
        }

        command.execute(msg);  

    } catch (err) {
        logger.error(err);

    }
}

function getModules() {
    return modules;
}

function init() {
    loadCommands();
}

module.exports = {
    "init": init,
    "loadCommands": loadCommands,
    "saveCommands": saveCommands,
    "checkCommand": checkCommand,
    "getModules": getModules
};