const buttons = require('./buttonsInteractions.js');

module.exports = {
    name: 'interactionCreate',
    execute(interaction) {
        const client = interaction.client;

        try {
            if (interaction.isCommand()) {
                const command = client.commands.get(interaction.commandName);
                if (!command) return;
                command.execute(interaction);
            } else if (interaction.isButton()) {
                buttons.execute(interaction);
            }
        } catch (error) {
            console.error(error);
            interaction.reply({ content: "Petit pépin lors de l'éxécution de la commande... Regarde la console jp stp.", ephemeral: true });
        }
    }
};