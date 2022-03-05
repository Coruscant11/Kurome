const MFA = require('mangadex-full-api');
const { mdLogin, mdPswd } = require('./config.json')

MFA.login(mdLogin, mdPswd, './bin/.md_cache').then(async() => {
    // Get a manga:
    let manga = await MFA.Manga.getByQuery('Akame ga kill');

    // Get the manga's chapters:
    let chapters = await manga.getFeed({ translatedLanguage: ['en'] }, true);
    // True means that related objects are returned with the base request
    // See Release 5.2.0 for more info: https://github.com/md-y/mangadex-full-api/releases/tag/5.2.0
    let chapter = chapters[0];

    // Get the chapter's pages:
    let pages = await chapter.getReadablePages();
    // Please read the following page if you are creating a chapter-reading application:
    // https://api.mangadex.org/docs.html#section/Reading-a-chapter-using-the-API/Report

    // Get who uploaded the chapter:
    let uploader = await chapter.uploader.resolve();

    // Get the names of the groups who scanlated the chapter:
    let resolvedGroups = await MFA.resolveArray(chapter.groups) // You can resolve Relationship arrays with this shortcut
    let groupNames = resolvedGroups.map(elem => elem.name);

    console.log(`Manga "${manga.title}" a ${chapters.length} chapitres.`);
}).catch(console.error);