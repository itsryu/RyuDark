import { CommandStructure, CommandData } from '../../Structures';
import { Ryuzaki } from '../../RyuzakiClient';
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

export default class PingCommand extends CommandStructure<Ryuzaki, PingCommandData> {
    constructor(client: Ryuzaki) {
        super(client, new PingCommandData());
    }

    execute({ message }: { message: Message }): Promise<any> {
        return message.reply((String(this.client.websocket.ping) + 'ms'));
    }
}