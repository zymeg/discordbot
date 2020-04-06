var Discord = require('discord.js');

var bot = new Discord.Client({});


bot.on('ready', function(event) {
    console.log(`Logged in as ${bot.user.tag}\n`);
});

bot.on('message', msg => {
    if (msg.content === "ping") {
        msg.reply('pong')
    }
});

bot.login('Njk2NzI1OTEyNjMyMjk1NDM2.Xot07w.0xYMO2Lhfkf2FW4bp67TilsxUsU')