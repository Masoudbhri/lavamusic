const { MessageEmbed, CommandInteraction, Client} = require("discord.js");
const db = require("../../schema/playlist");

module.exports = {
    name: "create",
    description: "Creates the user's playlist.",
    player: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    options: [
        {
            name: "name",
            description: "Playlist name",
            required: true,
            type: "STRING"
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction, prefix) => {

        await interaction.deferReply({});

        const Name = interaction.options.getString("name").replace(/_/g, ' ');
        const data = await db.find({ UserId: interaction.member.user.id, PlaylistName: Name });

        if (Name.length > 10) {
            return interaction.editReply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(`Playlist Name can't be greater than 10 Characters`)] });

        };
        if (data.length > 0) {
            return interaction.editReply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(`This playlist already exists! delete it using: \`${prefix}\`delete \`${Name}\``)] })
        };
        let userData = db.find({
            UserId: interaction.user.id
        });
        if (userData.length >= 10) {
            return interaction.editReply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(`You can only create 10 Playlists`)] })
        }
        const newData = new db({
            UserName: interaction.user.tag,
            UserId: interaction.user.id,
            PlaylistName: Name,
            CreatedOn: Math.round(Date.now() / 1000)
        });
        await newData.save();
        const embed = new MessageEmbed()
            .setDescription(`Successfully created a playlist for you **${Name}**`)
            .setColor(client.embedColor)
        return interaction.editReply({ embeds: [embed] })

    }
};
