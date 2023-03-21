import { CommandData } from '../../../Structures';

class PingCommandDataConstructor extends CommandData {
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

export const PingCommandData = new PingCommandDataConstructor();