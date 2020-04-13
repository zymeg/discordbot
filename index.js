const Discord = require('discord.js');
const dotenv = require('dotenv').config(); 

var players = [];
var roles = [];
var votes = [];
var voted = [];
var mafiaVotes = [];
var mafiaVoted = [];
var signInTime, signing, isPlaying = 0, status = 'night', checkedPerson, guardedPerson;

var bot = new Discord.Client({});

function newGame() {
    status = 'day';
    checkedPerson = ''
    guardedPerson = ''
    votes = []
    voted = []
    mafiaVotes = []
    mafiaVoted = []
    let mafiaLength;
    if(players.length <= 7) {mafiaLength = 2;}
    else if(players.length <= 10) {mafiaLength = 3;}
    else if(players.length <= 13) {mafiaLength = 4;}
    else if(players.length > 13) {mafiaLength = 5;}
    
    let komisarzCount = 0;
    let ochroniarzCount = 0;

    do{
        let num = rand(0, players.length)
        if(players[num].role == '' || !players[num].role){
            players[num].role = 'Komisarz'
            ++komisarzCount
        }
    }while(komisarzCount == 0 )

    do{
        let num = rand(0, players.length)
        if(players[num].role == '' || !players[num].role){
            players[num].role = 'Ochroniarz'
            ++ochroniarzCount
        }
    }while(ochroniarzCount == 0 )

    // if(mafiaLength == 3){
    //     let likwidatorCount;
    //     do{
    //         let num = rand(0, players.length)
    //         if(players[num].role == '' || !players[num].role){
    //             players[num].role = 'Likwidator'
    //             ++likwidatorCount
    //         }
    //     }while(likwidatorCount == 0 )
    // }
    
    if(mafiaLength == 3){
        let sedziaCount;
        do{
            let num = rand(0, players.length)
            if(players[num].role == '' || !players[num].role){
                players[num].role = 'Sędzia'
                ++sedziaCount
            }
        }while(sedziaCount == 0 )
    }

    do{
        let num = rand(0, players.length)
        if(players[num].role == '' || !players[num].role){
            players[num].role = 'Mafia'
            --mafiaLength
        }
    }while(mafiaLength != 0 )
    

    players.forEach(e => {
        if(e.role != ''){
            let role = roles.find(roles.find(role => role.name == e.role))
            e.roles.add(role.id)
              .then(() => msg.reply('Dodano rolę'))
              .catch(e => console.log(e));
        }
    })

}

function vote(msg){

    if(voted.find(e => e == msg.author.id)){
        return 'Już głosowałeś...'
    }else {
        if(!votes.find(e => e.id == msg.mentions.members.first().id)){
            votes.push({
                id: msg.mentions.members.first().id,
                votes: 1
            })
        }else {
            votes.forEach(e => {
                if(e.id == msg.mentions.members.first().id) {
                    ++e.votes
                }
            })
        }

        voted.push(msg.author.id)

        if(voted.length = (players.length + 1) ) checkKill()
        return 'Oddałeś nowy głos...'
    }
}

function checkKill(){
    let max = {
        id: '',
        votes: 0
    }
    
    mafiaVotes.forEach(e => {
        if(e.votes > max.votes) {
            max.votes = e.votes
            max.id = e.id
        }
    })

    players.forEach(e => {
        if(e.id == max.id){
            if(e._roles != ''){
                e._roles.forEach(e => {
                e.roles.remove(e)
                  .then(() => console.log('cipka'))
                  .catch(e => console.log(e));
                })
            }

            let role = roles.find(roles.find(role => role.name == 'Przegrani'))
            e.roles.add(role.id)
              .then(() => console.log(`Mafia zabija`))
              .catch(e => console.log(e));

        }
    })
}


bot.on('ready', e => {
    console.log(`Logged in as ${bot.user.tag}\n`);
});

bot.on('message', msg => {

    if(msg.content.startsWith('!test')){
        console.table(msg.mentions.members.first().name)
    }

    // Początek gry
    if (msg.content.startsWith("!new")) {
        if(msg.channel.name == 'ogólny'){
            msg.guild.roles.fetch()
             .then(res => res.cache.forEach(e => roles.push(e)))
             .catch(e => console.error(e))
             
            if(isPlaying === 0){
                players.push(msg.guild.member(msg.author))
                players[0].role = 'Gospodarz'
                isPlaying = 1;
                signInTime = 180;
                signing = 1;
                msg.reply(`Rozpoczynasz nową grę...\nUżyj komendy\n!play\nAby dołączyć do gry!\nMasz na to ${signInTime}s`)
                let signIn = setInterval(() => {
                    if(signInTime != 0){
                    --signInTime
                    }else {
                        signing = 0;
                        msg.reply('Koniec rejestracji. Rozpoczyna się nowa gra...')
                        newGame();
                        console.log('Gra wystarowała...')
                        clearInterval(signIn)
                    }

                    if(signInTime == 120) msg.reply(`Zapisy otwarte jeszcze przez 2 minuty!`);
                    if(signInTime == 60) msg.reply(`Zapisy otwarte jeszcze przez 1 minutę!`);
                    if(signInTime == 10) msg.reply(`Zapisy otwarte jeszcze przez 10 sekund!`);
                }, 1000)

            }else {
                msg.reply('Aktualnie trwa gra!')
            }
        }
    }

    
    if (msg.content.startsWith("!judge")) {
        if(msg.channel.name == 'sędzia'){
            if(status == 'night'){
                vote(msg);
                msg.reply(`Oddajesz dodatkowy głos na ${msg.mentions.members.first().name}`)
                
            }
        }
    }

    if (msg.content.startsWith("!officer")) {
        if(msg.channel.name == 'komisarz'){
            if(status == 'night'){
                if(checkedPerson != 1){
                    msg.reply(`Sprawdzasz ${msg.mentions.members.first()}`)
                    if(msg.mentions.members.first().role == 'Mafia'){
                        msg.reply('Gracz przez Ciebie sprawdzany jest w Mafii')
                    }else {
                        msg.reply('Gracz przez Ciebie sprawdzany nie jest w Mafii')
                    }

                    checkedPerson = 1;
                }
            }
        }
    }

    if (msg.content.startsWith("!bodyguard")) {
        if(msg.channel.name == 'ochroniarz'){
            if(status == 'night'){
                if(guardedPerson != ''){
                    msg.reply(`Chronisz ${msg.mentions.members.first()}`)

                    guardedPerson = msg.mentions.members.first().id;
                }
            }
        }
    }


    if (msg.content.startsWith("!kill")) {
        if(msg.channel.name == 'mafia'){
            if(status == 'night'){
                if(guardedPerson != ''){
                    msg.reply(`Głosujesz za zabiciem ${msg.mentions.members.first()}`)

                    if(voted.find(e => e == msg.author.id)){
                        msg.reply('Już głosowałeś...')
                    }else {
                        if(!mafiaVotes.find(e => e.id == msg.mentions.members.first().id)){
                            mafiaVotes.push({
                                id: msg.mentions.members.first().id,
                                votes: 1
                            })
                        }else {
                            mafiaVotes.forEach(e => {
                                if(e.id == msg.mentions.members.first().id) {
                                    ++e.votes
                                }
                            })
                        }
                
                        mafiaVoted.push(msg.author.id)
                    }

                    if(players.length <= 7 && mafiaVoted.length == 2) {checkKill()}
                    else if(players.length <= 9 && mafiaVoted.length == 3) {checkKill()}
                    else if(players.length > 9 && mafiaVoted.length == 4) {checkKill()}
                    
                }else{
                    msg.reply('Poczekaj na ochroniarza!')
                }
            }
        }
    }

    if(msg.content.startsWith('!vote')){
        if(status == 'day'){
            msg.reply(vote(msg))
        }
    }


    if(msg.content.startsWith('!play')) {
        if(signing == 1){
            players.push(msg.guild.member(msg.author))
            msg.reply('dołączasz do gry!')
            console.table(players)
        }
    }

    if(msg.content == '!day'){
        if(msg.channel.name == 'administracja'){
            status = 'day'
            voted = [];
            mafiaVoted = [];
            mafiaVotes = []
            checkedPerson = ''
            guardedPerson = ''
        }
    }
    
    if(msg.content == '!night'){
        if(msg.channel.name == 'administracja'){
            status = 'night'
            votes = []
        }
    }
});


bot.login(process.env.TOKEN)