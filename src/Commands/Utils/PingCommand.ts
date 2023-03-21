import { CommandStructure,  ClientEmbed } from '../../Structures';
import { PingCommandData } from '../../Data/Commands/Utils/PingCommandData';
import { RyuDark } from '../../RyuClient';
import { Message } from 'darkcord';

export default class PingCommand extends CommandStructure {
    constructor(client: RyuDark) {
        super(client, PingCommandData);
    }

    execute({ message }: { message: Message }) {
        const messageMs: string = (Date.now() - message.timestamp) + 'ms';
        const clientMs: string = this.client.websocket.ping + 'ms';
        const embed = new ClientEmbed(this.client.user, {
            title: 'Ping 🏓',
            description: `Latência da API: \`${clientMs}\`\nLatência da mensagem: \`${messageMs}\``
        });

        return message.reply({ embeds: [embed] });
    }
}