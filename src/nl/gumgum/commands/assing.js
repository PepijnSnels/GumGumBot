const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('assign')
        .setDescription('Assigns a role to a user')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to assign')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const role = interaction.options.getRole('role');
            const user = interaction.user;
            const member = interaction.guild.members.cache.get(user.id);

            await member.roles.add(role);
            await interaction.reply(`Role ${role.name} assigned to ${user.tag}`);
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while assigning the role.');
        }
    },
};