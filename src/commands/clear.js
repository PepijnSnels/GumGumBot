const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clears messages in chat')
        .addIntegerOption(option => 
            option.setName('amount')
            .setDescription('The Amount of messages that need to be cleared.')
            .setRequired(true)),
	async execute(interaction) {
        const amount = interaction.options.get('amount');
        interaction.channel.bulkDelete(amount.value, true).then(() =>{
            interaction.reply({ content: `Cleared ${amount.value} messages.`, ephemeral: true }).then((reply) => {
                setTimeout(() => {
                  reply.delete();
                }, 3000);
              });
        }) 
	},
};

