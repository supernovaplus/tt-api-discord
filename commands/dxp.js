const cache = require("memory-cache");
const { enc } = require("../utils");

module.exports = {
    command: 'dxp',
    info: 'dxp list',
    async run({message, ttApi}) {
        const msg = await message.channel.send("Loading...")

        const data = (
            await Promise.all([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((serverIndex) => ttApi.getPlayersWidget(serverIndex).catch(err => undefined)))
            .then(res => (res || []).filter(serverData => serverData && serverData?.server?.dxp[0])) //filter out offline servers and servers without dxp
            .catch(err => { console.log(err); return []; })
        )

        msg.edit(enc(
            `[DXP]\n` + (
                    data.length === 0 ? "No DXP Found" :
                        data.map(serverData =>
                            `[Server ${serverData.server.number} => / DXP: ${serverData.server.dxp[0]} / Players: ${serverData.players.length}/${serverData.server.limit} / Uptime: ${serverData.server.uptime}]`
                        ).join("\n"))
        ));
    }
};