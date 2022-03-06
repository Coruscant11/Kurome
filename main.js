const fs = require("node:fs");

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const { Client, Intents, Collection } = require('discord.js');
const { token } = require('./config.json');


var dir = './bin';
if (!fs.existsSync(dir)) fs.mkdirSync(dir);


const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    console.log(`Commande ${command.data.name} mise sous écoute.`);
}

const eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(token);