const cache = require("memory-cache");
const { enc, serversList } = require("../utils");

module.exports = {
    command: 'join',
    info: 'join server',
    async run({message, args, ttApi, prefix}) {
        let selectedServer = parseInt(args[0]);

        if(!selectedServer || selectedServer > serversList.length || selectedServer < 1) {
            message.reply(`Invalid server id, use ***${prefix}weather 1*** or use ***${prefix}servers*** for server list`)
            return;
        }
        
        // since server[0] is SERVER #1 we shift the index so server[1] would show up as SERVER #1 instead of SERVER #2
        selectedServer -= 1;

        //attempt to get the data from cache
        let data = cache.get("getPlayersWidget" + selectedServer)
        if(!data){
            data = await ttApi.getPlayersWidget(selectedServer).catch(err=>console.log(err));

            if(!data) {
                message.reply("Failed to load the data, try again later.");
                return;
            }

            //cache result
            cache.put("getPlayersWidget" + selectedServer, {...data, timestamp: Date.now()}, 10000); //10000 = 10 seconds
        }

        message.channel.send(enc(
            `[Server: ${serversList[selectedServer][1]}]\n` +
            `Uptime: ${data.server.uptime}\n` +
            `Players: ${data.players.length}/${data.server.limit}\n` +
            `DXP: ${data.server.dxp[0] ? JSON.stringify(data.server.dxp[0]) : "-"}\n`
        ));
    }
};