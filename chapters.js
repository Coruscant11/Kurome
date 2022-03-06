const { MessageEmbed } = require('discord.js');

module.exports = {
    buildChaptersFromVolume(volume, chapters, mangaTitle) {
        const chaptersOptions = [];
        for (c of chapters) {
            if (c.volume == volume) {
                chaptersOptions.push({ label: `${c.chapter} : ${c.title}`, description: `${c.title} : ${c.pages} page(s). Volume ${c.volume}`, value: `${c.chapter}%%%%${mangaTitle}%%%%${c.volume}` });
            }
        }
        return chaptersOptions;
    },

    buildChapterImageEmbed(chapterNumber, page, pages, chapters) {
        let chapter = chapters.find(x => x.chapter == chapterNumber);

        chapterImageEmbed = new MessageEmbed()
            .setTitle(`${chapterNumber} : ${chapter.title}`)
            .setDescription(`Page ${page + 1}/${pages.length}`)
            .setURL(pages[page])
            .setFooter({ text: `Volume ${chapter.volume}` });

        console.log(pages[page]);
        return chapterImageEmbed;
    },
    async uploadEmbedImage(interaction, url) {

        interaction.channel.send({
            files: [{
                attachment: url,
                name: "scan.jpg",
            }]
        });
    }
}