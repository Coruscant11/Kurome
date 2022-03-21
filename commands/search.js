const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { mdLogin, mdPswd } = require('../config.json')
const MFA = require('mangadex-full-api');

const SEPARATOR = "%%%%";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("search")
        .setDescription("Recherche un manga sur MangaDex.")
        .addStringOption(option =>
            option.setName('manga_name')
            .setDescription('Titre du manga a rechercher.')
            .setRequired(true))
        .addStringOption(option =>
            option.setName("language")
            .setDescription("Translation language")
            .setRequired(true)),

    async execute(interaction) {
        const search_manga_option = interaction.options.getString('manga_name');
        const search_language_option = interaction.options.getString("language");

        MFA.login(mdLogin, mdPswd, './bin/.md_cache').then(() => {
            MFA.Manga.search({
                title: search_manga_option,
                limit: 5
            }).then(results => {
                if (results.length > 0) {
                    let buttons = []
                    let responses = ""
                    const searchResult = new MessageEmbed()
                        .setTitle(`J'ai fini la recherche de "${search_manga_option}".`)
                        .setAuthor({ name: "Kurome" })
                        .setThumbnail("https://cdn.discordapp.com/attachments/709456544995213352/949383897458827284/searchkurome.png");
                    results.forEach((elem, i) => {
                        let title;
                        if (elem.title.length > 70)
                            title = elem.title.substring(0, 70);
                        else
                            title = elem.title;

                        searchResult.addField(`${i+1} : ` + title, elem.id + 1);
                        buttons.push(new MessageButton()
                            .setCustomId(`${title}${SEPARATOR}${search_language_option}`)
                            .setLabel(`${i+1}`)
                            .setStyle('PRIMARY')
                        );
                    });
                    row = new MessageActionRow().addComponents(buttons)
                    interaction.reply({ embeds: [searchResult], components: [row] });
                } else {
                    interaction.reply(`Je n'ai trouvé aucun manga pour "${search_manga_option}".`);
                }
            }).catch(console.error);
        }).catch(console.error);
    }
}