const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity(`nothing, I am a bot lol`);
});
client.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "ping") {
        message.channel.send("Pingin'...").then(m => {
            m.edit(`Pong! API Latency is ${Math.round(client.ping)}ms`);
        });
    }
    if (command === "kick") {
        if (!message.member.roles.some(r => ["Administrator", "Moderator"].includes(r.name))) return message.reply("Error 403: Access is denied. Maybe check your permissions?");
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member) return message.reply("Uhh, you need to specify who you want to kick.");
        if (!member.kickable) return message.reply("Error 403; you can't kick TheDeviceWolf.");
        let reason = args.slice(1).join(' ');
        if (!reason) reason = "No reason provided";
        member.kick(reason).then(() => {
            message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
        }).catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    }
    if (command === "ban") {
        if (!message.member.roles.some(r => ["Administrator"].includes(r.name))) return message.reply("Error 403: Access is denied. Maybe check your permissions?");
        let member = message.mentions.members.first();
        if (!member) return message.reply("Uhh, you need to specify who you want to ban.");
        if (!member.bannable) return message.reply("Error 403; you can't ban TheDeviceWolf.");
        let reason = args.slice(1).join(' ');
        if (!reason) reason = "No reason provided";
        member.ban(reason).then(() => {
            message.reply(`${message.author.tag} striked ${member.user.tag} with the ban hammer because: ${reason}`);
        }).catch(error => message.reply(`Error: ${error}`));	
    }
});
client.login(config.token);