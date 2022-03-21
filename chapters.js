const { MessageEmbed } = require('discord.js');

module.exports = {
    buildChaptersFromVolume(volume, chapters, mangaTitle) {
        if (mangaTitle.length > 50)
            mangaTitle = mangaTitle.substring(0, 50);

        const chaptersOptions = [];
        for (c of chapters) {
            if (c.volume == volume) {
                chaptersOptions.push({
                    label: `${c.chapter} : ${c.title}`,
                    description: `${c.title} : ${c.pages} page(s). Volume ${c.volume}`,
                    value: `${c.id}%%%%${mangaTitle}%%%%${c.volume}`
                });
            }
        }
        return chaptersOptions;
    },

    buildChapterImageEmbed(chapterId, page, pages, chapters) {
        let chapter = chapters.find(x => x.id == chapterId);

        chapterImageEmbed = new MessageEmbed()
            .setTitle(`${chapter.chapter} : ${chapter.title}`)
            .setDescription(`Page ${page + 1}/${pages.length}`)
            .setURL(pages[page])
            .setFooter({ text: `Volume ${chapter.volume}` });

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