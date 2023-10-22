const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaguememe')
		.setDescription('Sends a Random League MEME (pas vanaf level 6 tho)'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};