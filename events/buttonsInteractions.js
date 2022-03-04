module.exports = {
    execute(interaction) {
        if (!interaction.isButton()) return;

        interaction.update({ components: [] })
        console.log(`${interaction.user.tag} a choisi ${interaction.customId}.`);
    }
}