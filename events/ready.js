module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Le bot s'est connectée en tant que ${client.user.tag}`);
    },
};