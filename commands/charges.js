
const { enc } = require("../utils");

module.exports = {
    command: 'charges',
    info: 'get charges',
    async run({message, ttApi}) {
        const charges = await ttApi.getCharges();
        message.channel.send(
            enc(
                charges ? 
                    "Charges left: " + Number(charges).toLocaleString("en-US") : 
                        "No charges left or cannot connect to the server"
            )
        );
    }
};