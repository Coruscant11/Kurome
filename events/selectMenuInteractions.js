const { mdLogin, mdPswd } = require('../config.json')
const MFA = require('mangadex-full-api');
const chaptersAssets = require("../chapters.js");

module.exports = {
    execute(interaction) {
        if (!interaction.isSelectMenu()) return;

        interactionIdSplit = interaction.values[0].split("%%%%");
        const chapterNumber = parseInt(interactionIdSplit[0]);
        const mangaTitle = interactionIdSplit[1];
        console.log("chapter number : " + chapterNumber);

        MFA.login(mdLogin, mdPswd, './bin/.md_cache').then(async() => {
            let manga = await MFA.Manga.getByQuery(interaction.customId);
            let chapters = await manga.getFeed({ translatedLanguage: ['en'] }, true);
            chapters.sort((a, b) => parseFloat(a.chapter) - parseFloat(b.chapter));
            let chapter = chapters.find(x => x.chapter == chapterNumber);
            let pages = await chapter.getReadablePages();
            console.log("chapter metadata : ");
            console.log("\tchapter : " + chapter.chapter);
            console.log("\tvolume : " + chapter.volume);
            console.log("\ttitle : " + chapter.title);
            console.log();

            chapterImageEmbed = chaptersAssets.buildChapterImageEmbed(chapterNumber, 0, pages, chapters);
            interaction.message.components[1].components[1].setDisabled(true);
            interaction.message.components[1].components[2].setDisabled(false);
            interaction.message.components[1].components[4].setDisabled(false);

            await interaction.channel.send({ components: interaction.message.components, embeds: [chapterImageEmbed] });
            await chaptersAssets.uploadEmbedImage(interaction, pages[0]);
            await interaction.message.delete();
        });
    }
}