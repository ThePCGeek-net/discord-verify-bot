const { Client, GatewayIntentBits, ApplicationCommandOptionType, PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
    ]
});

client.on("ready", () => {
    console.log("Bot is online!");
});
client.on("error", console.error);
client.on("warn", console.warn);

client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;
    if (!client.application?.owner) await client.application?.fetch();

    if (message.content === "!deploy" && message.author.id === client.application?.owner?.id) {
        await message.guild.commands.set([
            {
                name: 'setup',
                description: 'Sets up the verify bot',
                defaultMemberPermissions: PermissionFlagsBits.Administrator,
                options: [
                    {
                        name: 'channel',
                        type: ApplicationCommandOptionType.Channel,
                        channelTypes: ChannelType.GuildText,
                        description: 'The channel to post message in (welcome channel)',
                        required: true
                    }
                ]
            },
        ]);

        await message.reply("Deployed!");
    }
    if (message.content === "!undeploy" && message.author.id === client.application?.owner?.id) {
        await message.guild.commands.set([]);
        await message.reply("Commands Cleared");
    }
});

client.on("interactionCreate", async (interaction) => {
    //if (!interaction.isCommand() || !interaction.guildId) return;
    if (interaction.isChatInputCommand()){
        switch (interaction.commandName){
            case 'setup' :{
                const channel = interaction.options.getChannel('channel');
                channel.send({
                    embeds: [
                        new EmbedBuilder().setDescription(
                            `Welcome to the server. Once you have read and agree to the above rules please verify by clicking the button below.`)
                            .setColor('DarkRed')
                            .setTitle(`Welcome to ${interaction.guild?.name}`),
                    ],
                    components: [
                        new ActionRowBuilder().setComponents(
                            new ButtonBuilder()
                            .setCustomId('verifyMember')
                            .setLabel('Verify')
                            .setEmoji('✅')
                            .setStyle(ButtonStyle.Primary)
                        ),
                    ],
                });
                return void interaction.reply('message sent');
                break;
            }
        }
    } else if (interaction.isButton()){
        switch (interaction.customId){
            case 'verifyMember': {
                console.log('verifying member...');
                const role = interaction.guild?.roles.cache.get(`${process.env.UNVERIFIED_ROLE}`);
                if (!role){
                    console.log('role doesnt exist');
                    return;
                }
                const member = interaction.member
                if (member.roles.cache.has(role.id)){
                    member.roles
                    .remove(role)
                    .then((m) => 
                    interaction.reply({ content:`success`, ephemeral: true }))
                    .catch((err) => 
                    interaction.reply({ content: `Something went wrong`, ephemeral: true, }));
                } else {
                    interaction.reply({ content: `You are already verified`, ephemeral: true, });
                }
                
                break;
            }
        }
    }

});

client.on('guildMemberAdd', member => {
    const role = member.guild?.roles.cache.get(`${process.env.UNVERIFIED_ROLE}`);
    if(!role){
        console.log(`couldnt assign role...doesn't exist.`);
        return;
    }
    member.roles.add(role.id);
    console.log(`Member ${member} joined, unverified role assigned`);
});

client.login(process.env.BOT_TOKEN);