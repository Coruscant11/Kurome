const { mdLogin, mdPswd } = require('../config.json')
const MFA = require('mangadex-full-api');
const { MessageActionRow, MessageSelectMenu, MessageSelectOptionData, MessageButton, MessageEmbed } = require('discord.js');
const chaptersAssets = require("../chapters.js");

const LEFT = -1;
const RIGHT = 1;
const PREVIOUS_VOLUME = 0;
const PREVIOUS_CHAPTER = 1;
const NEXT_CHAPTER = 2;
const NEXT_VOLUME = 3;
const SEPARATOR = "%%%%";


function launchMangaButtonAction(interaction) {
    interaction.message.delete();
    const client = interaction.client;

    const prevVolEmoji = client.emojis.cache.find(emoji => emoji.name === "track_previous");
    const prevChapEmoji = client.emojis.cache.find(emoji => emoji.name === "track_next");
    const nextChapEmoji = client.emojis.cache.find(emoji => emoji.name === "rewind");
    const nextVolEmoji = client.emojis.cache.find(emoji => emoji.name === "fast_forward");

    MFA.login(mdLogin, mdPswd, './bin/.md_cache').then(async() => {
        let manga = await MFA.Manga.getByQuery(interaction.customId);
        let chapters = await manga.getFeed({ translatedLanguage: ['en'] }, true);
        chapters.sort((a, b) => parseFloat(a.chapter) - parseFloat(b.chapter));



        const selectRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                .setCustomId(`${interaction.customId}${SEPARATOR}{chapters[0].volume}`)
                .setPlaceholder("Rien de sélectionné.")
                .addOptions(chaptersAssets.buildChaptersFromVolume(chapters[0].volume, chapters, interaction.customId)),
            );

        console.log(manga.lastVolume);

        const navigationsButtonsRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId(`volumeLeft%%%%${interaction.customId}${SEPARATOR}${(+new Date).toString(36)}`)
                .setLabel(prevVolEmoji)
                .setDisabled(true)
                .setStyle("PRIMARY"),
                new MessageButton()
                .setCustomId(`pageLeft%%%%${interaction.customId}${SEPARATOR}${(+new Date).toString(36)}`)
                .setLabel(prevChapEmoji)
                .setDisabled(true)
                .setStyle("PRIMARY"),
                new MessageButton()
                .setCustomId(`pageRight%%%%${interaction.customId}${SEPARATOR}${(+new Date).toString(36)}`)
                .setLabel(nextChapEmoji)
                .setDisabled(true)
                .setStyle("PRIMARY"),
                new MessageButton()
                .setCustomId(`volumeRight%%%%${interaction.customId}${SEPARATOR}${(+new Date).toString(36)}`)
                .setLabel(nextVolEmoji)
                .setDisabled(manga.lastVolume === "" || manga.lastVolume > chapters[0].volume)
                .setStyle("PRIMARY")
            )

        interaction.channel.send({ components: [selectRow, navigationsButtonsRow] });

        //let pages = await chapter.getReadablePages();
    }).catch(console.error);
}

function volumeChangeButtonAction(interaction, direction) {
    const firstSelectSplit = interaction.message.components[0].components[0].options[0].value;
    const interactionIdSplit = firstSelectSplit.split("%%%%");
    const mangaTitle = interactionIdSplit[1];
    let volume = interactionIdSplit[2];
    let selectRow = interaction.message.components[0];
    const navigationButtonsRow = interaction.message.components[1];

    MFA.login(mdLogin, mdPswd, './bin/.md_cache').then(async() => {
        let manga = await MFA.Manga.getByQuery(mangaTitle);
        let chapters = await manga.getFeed({ translatedLanguage: ['en'] }, true);
        chapters.sort((a, b) => parseFloat(a.chapter) - parseFloat(b.chapter));

        let newVolume = parseInt(volume) + direction;
        selectRow.components[0].setOptions(chaptersAssets.buildChaptersFromVolume(newVolume, chapters, mangaTitle));

        if (newVolume == 0) {
            navigationButtonsRow.components[PREVIOUS_VOLUME].setDisabled(true);
        } else if (newVolume > 1) {
            navigationButtonsRow.components[PREVIOUS_VOLUME].setDisabled(false);
        } else if (newVolume == manga.lastVolume) {
            navigationButtonsRow.components[NEXT_VOLUME].setDisabled(false);
        }

        await interaction.channel.send({ embeds: interaction.message.embeds, components: [selectRow, interaction.message.components[1]] });
        //await interaction.update({ embeds: [], components: [], content: `Volume ${volume} lue.` });
        await interaction.message.delete();
    });
}

function pageChangeButtonAction(interaction, direction) {
    const firstSelectSplit = interaction.message.components[0].components[0].options[0].value;
    const interactionIdSplit = firstSelectSplit.split(SEPARATOR);
    const mangaTitle = interactionIdSplit[1];
    const navigationButtonsRow = interaction.message.components[1];

    if (interaction.message.embeds.length > 0) {
        let actualPage = parseInt(interaction.message.embeds[0].description.split(' ')[1].split('/')[0]) - 1;
        actualPage = actualPage + direction;
        let actualChapter = parseInt(interaction.message.embeds[0].title.split(' : ')[0]);

        MFA.login(mdLogin, mdPswd, './bin/.md_cache').then(async() => {
            let manga = await MFA.Manga.getByQuery(mangaTitle);
            let chapters = await manga.getFeed({ translatedLanguage: ['en'] }, true);
            chapters.sort((a, b) => parseFloat(a.chapter) - parseFloat(b.chapter));
            let chapter = chapters.find(x => x.chapter == actualChapter);
            let pages = await chapter.getReadablePages();

            if (actualPage == 0) {
                navigationButtonsRow.components[PREVIOUS_CHAPTER].setDisabled(true);
            } else if (actualPage > 0) {
                navigationButtonsRow.components[PREVIOUS_CHAPTER].setDisabled(false);
            }
            if (actualPage == pages.length - 1) {
                navigationButtonsRow.components[NEXT_CHAPTER].setDisabled(true);
            }

            chapterImageEmbed = chaptersAssets.buildChapterImageEmbed(actualChapter, actualPage, pages, chapters);

            await chaptersAssets.uploadEmbedImage(interaction, pages[actualPage]);
            await interaction.channel.send({ embeds: [chapterImageEmbed], components: interaction.message.components });
            await interaction.message.delete();
        });
    }
}

module.exports = {
    execute(interaction) {
        if (!interaction.isButton()) return;

        const interactionSplit = interaction.customId.split(SEPARATOR);
        switch (interactionSplit[0]) {
            case "volumeLeft":
                volumeChangeButtonAction(interaction, LEFT);
                break;
            case "volumeRight":
                volumeChangeButtonAction(interaction, RIGHT);
                break;
            case "pageLeft":
                pageChangeButtonAction(interaction, LEFT);
                break;
            case "pageRight":
                pageChangeButtonAction(interaction, RIGHT);
                break;
            default:
                launchMangaButtonAction(interaction);
                break;
        }
    }
}