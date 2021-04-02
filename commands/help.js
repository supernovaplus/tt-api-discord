const { enc } = require("../utils");

module.exports = {
	command: 'help',
	info: 'list of commands',
	run({message, bot, prefix}) {
		message.channel.send(enc(`[Commands]\n${bot.commands.map(cmd=>`${prefix}${cmd.command} - ${cmd.info}`).join("\n")}`));
	},
};