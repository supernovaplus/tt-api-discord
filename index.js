/*
.env file looks like:
BOT_TOKEN=token
TT_TOKEN=token
*/

require('dotenv').config();
const Discord = require("discord.js");
const { TransportTycoon } = require('transporttycoon');
const bot = new Discord.Client();
const fs = require('fs');

//true for "prefix command" | example: "!tt help"
//false for "prefixcommand" | example: "!tthelp"
const appendSpace = true;
const customPrefix = "!tt";

const prefix = customPrefix + (appendSpace ? " " : "");
const ttApi = new TransportTycoon(process.env.TT_TOKEN, true);

bot.commands = new Discord.Collection();
for (const file of fs.readdirSync('./commands').filter(file => file.endsWith('.js'))) {
    const fn = require(`./commands/${file}`);
    bot.commands.set(fn.command, fn);
}
console.log("Loaded: [" + (bot.commands.map(el=>el.command).join(", ") || "---") + "] commands")

bot.on('ready', async () => {
    console.log(`Discord bot started as ${bot.user.tag}!`);

    if(!await ttApi.setupCharges()) {
        console.log("TTAPI Setup charges failed: No server is online / Ran out of charges / Invalid api key");
    }else{
        console.log(`Current TT charges: ${await ttApi.getCharges()}`)
    }
});

bot.on("message", message => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;
    // if(message.channel.id !== "your bot channel id") return; //uncooment if you want to lock the commands to a single channel

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (!bot.commands.has(command)) return;

    try {
        bot.commands.get(command).run({
            bot,
            message,
            args,
            ttApi,
            prefix
        });
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
});

bot.login(process.env.BOT_TOKEN);