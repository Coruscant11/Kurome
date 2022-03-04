module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Kurome s'est connectée en tant que ${client.user.tag}`);
    },
};