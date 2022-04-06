const fs = require('fs'); //Definimos fs
let { readdirSync } = require('fs'); //Definimos readdirSync que también lo necesitamos
const Discord = require('discord.js'); //Definimos discord
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const config = require("./config.js");

client.on('message', (message) => { //Abrimos un evento message, esto es muy importante porque es donde estarán los comandos

  let prefix = 'c!' //Definimos un prefix para usar

  if (message.author.bot) return; //Con esto hacemos que el bot no responda a mensajes de otros bots lo cual evitará que entre en bucles
  if (!message.content.startsWith(prefix)) return; //Aquí hacemos que si el mensaje no empieza con el prefix el bot no responda

  let usuario = message.mentions.members.first() || message.member; //Definimos el usuario
  const args = message.content.slice(prefix.length).trim().split(/ +/g); //Definimos los argumentos
  const command = args.shift().toLowerCase(); //Definimos el comando

  let cmd = client.commands.find((c) => c.name === command || c.alias && c.alias.includes(command));
  if (cmd) {
    cmd.execute(client, message, args)

  }//Aquí irían los comandos que pondremos más adelante
  if(!cmd){
    if(message.content === prefix) return;
    const embed = new Discord.MessageEmbed()
    .setTitle(':x: Comando no encontrado')
    .setColor('RED')

    message.channel.send(embed)
  }


  if(message.content.startsWith('@here')){
    message.delete()
    const embed = new Discord.MessageEmbed()
    .setTile('Que haces? Eso no se hace.')
    .setColor('RED')
    
    message.channel.send(embed)
  }


  if(message.content.startsWith('https://')){
    message.channel.delete()
    const embed = new Discord.MessageEmbed()
    .setTitle('No puedes poner links')
    .setColor('RED')

    message.channel.send(embed)
  }
}); //Cerramos el evento







client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./comandos').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./comandos/${file}`);
  client.commands.set(command.name, command);
}

client.on("ready", () => {
    function presence(){
        client.user.setPresence({
            status: 'online',
            activity: {
                name: 'Chunpi de HANDERYT04 | Buscale en yt | Ayuda: c!help',
                type: 'WATCHING'
            }
        })
    }
    presence();
  console.log(`🟢 Bot online en ${client.user.tag}`)

}); //Mensaje que al conectarse con el bot aparezca en consola





client.on('guildMemberAdd', member => {
  const embed = new Discord.MessageEmbed()
  .setTitle('Bienvenido')
  .setDescription("Bienvenido al discord del canal de Hander YT! Diviertete!🤝 \n\n Recuerda pasarte por: \n\n <#> \n <#> \n\n Para no ser sancionado")
  .setFooter("Bot Chunp")
  .setImage('https://cdn.discordapp.com/attachments/909503332454924328/931592069670125568/standard_3.gif')
  .setColor('b80db5')

  client.channels.cache.get('928775909912244304').send(`${member}`,embed)
});

client.login(config.token)
