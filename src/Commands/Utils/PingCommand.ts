import { CommandStructure, CommandData } from '../../Structures';
import { RyuDark } from '../../RyuClient';
import { Message } from 'darkcord';

class PingCommandData extends CommandData {
    constructor() {
        super({
            name: 'ping',
            description: 'Exibe a latência da API.',
            aliases: ['pong'],
            config: {
                devOnly: false,
                registerSlash: true
            }
        });
    }
}

export default class PingCommand extends CommandStructure<RyuDark, PingCommandData> {
    constructor(client: RyuDark) {
        super(client, new PingCommandData());
    }

    execute({ message }: { message: Message }): Promise<any> {
        const messageMs: string = (Date.now() - message.timestamp) + 'ms';
        const clientMs: string = this.client.websocket.ping + 'ms';

        return message.reply(`Latência da API: \`${clientMs}\`\nLatência da mensagem: \`${messageMs}\``);
    }
}