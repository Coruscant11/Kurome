const { mdLogin, mdPswd } = require('../config.json')
const MFA = require('mangadex-full-api');
const chaptersAssets = require("../chapters.js");

module.exports = {
    execute(interaction) {
        if (!interaction.isSelectMenu()) return;

        interactionIdSplit = interaction.values[0].split("%%%%");
        console.table(interactionIdSplit)
        const chapterId = interactionIdSplit[0];
        const mangaTitle = interactionIdSplit[1];
        console.log(interaction.customId);

        MFA.login(mdLogin, mdPswd, './bin/.md_cache').then(async() => {
            console.log(interaction.customId)
            let manga = await MFA.Manga.getByQuery(mangaTitle);
            let chapters = await manga.getFeed({ translatedLanguage: ['en'] }, true);
            chapters.sort((a, b) => parseFloat(a.chapter) - parseFloat(b.chapter));
            console.table(chapters);
            let chapter = chapters.find(x => x.id == chapterId);
            let pages = await chapter.getReadablePages();

            chapterImageEmbed = chaptersAssets.buildChapterImageEmbed(chapterId, 0, pages, chapters);
            interaction.message.components[1].components[1].setDisabled(true);
            interaction.message.components[1].components[2].setDisabled(false);

            await interaction.channel.send({ components: interaction.message.components, embeds: [chapterImageEmbed] });
            await chaptersAssets.uploadEmbedImage(interaction, pages[0]);
            await interaction.message.delete();
        });
    }
}