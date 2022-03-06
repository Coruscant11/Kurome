const buttons = require('./buttonsInteractions.js');
const selectMenus = require('./selectMenuInteractions.js');
const chaptersAssets = require('../chapters.js');
const { Permissions } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    execute(interaction) {
        const client = interaction.client;
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return;

        try {
            if (interaction.isCommand()) {
                const command = client.commands.get(interaction.commandName);
                if (!command) return;
                command.execute(interaction);
            } else if (interaction.isButton()) {
                buttons.execute(interaction);
            } else if (interaction.isSelectMenu()) {
                selectMenus.execute(interaction);
            }
        } catch (error) {
            console.error(error);
            interaction.reply({ content: "Petit pépin lors de l'éxécution de la commande... Regarde la console jp stp.", ephemeral: true });
        }
    }
};