const { enc, serversList } = require("../utils");

module.exports = {
    command: 'servers',
    info: 'servers list',
    // since server[0] is SERVER #1 we shift the index so server[1] would show up as SERVER #1 instead of SERVER #2
    // index is shifted by one
    async run({message}) {
        message.channel.send(
            enc(
                "[Servers List]\n" +
                    serversList
                        .map((server, index) => `${index + 1}: ${server[1]} = ${server[0]}`)
                        .join('\n')
            )
        );
    }
};