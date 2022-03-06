const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { mdLogin, mdPswd } = require('../config.json')
const MFA = require('mangadex-full-api');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("search")
        .setDescription("Recherche un manga sur MangaDex.")
        .addStringOption(option =>
            option.setName('manga_name')
            .setDescription('Titre du manga a rechercher.')
            .setRequired(true)),
    async execute(interaction) {
        const search_manga_option = interaction.options.getString('manga_name');

        MFA.login(mdLogin, mdPswd, './bin/.md_cache').then(() => {
            MFA.Manga.search({
                title: search_manga_option,
                limit: 5 // API Max is 100 per request, but this function accepts more
            }).then(results => {
                if (results.length > 0) {
                    console.log(`\n${interaction.user.tag} viens de rechercher "${search_manga_option}" :`)
                    results.forEach((elem, i) => console.log(`\t[${i + 1}] ${elem.title}`));
                    let buttons = []
                    let responses = ""
                    const searchResult = new MessageEmbed()
                        .setTitle(`J'ai fini la recherche de "${search_manga_option}".`)
                        .setAuthor({ name: "Kurome" })
                        .setThumbnail("https://cdn.discordapp.com/attachments/709456544995213352/949383897458827284/searchkurome.png");
                    results.forEach((elem, i) => {
                        searchResult.addField(`${i+1} : ` + elem.title, elem.id + 1);
                        buttons.push(new MessageButton()
                            .setCustomId(`${elem.title}`)
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