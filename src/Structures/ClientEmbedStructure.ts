import { User } from 'darkcord';
import { APIEmbed } from 'discord-api-types/v10';

export class ClientEmbed {
    constructor(user: User | null, data: APIEmbed) {
        data.color = 0xF1F1F1;
        data.footer = { text: `${user?.username}`, icon_url: user?.displayAvatarURL({ size: 4096 }) };
        data.timestamp = new Date().toISOString();
        return data;
    }
}