import { CommandStructure } from '../../Structures';
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

        return message.reply(`Latência da API: \`${clientMs}\`\nLatência da mensagem: \`${messageMs}\``);
    }
}