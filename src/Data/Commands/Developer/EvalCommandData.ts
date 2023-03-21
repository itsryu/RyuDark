import { CommandData } from '../../../Structures';
import { ApplicationCommandOptionType} from 'discord-api-types/v10';

class EvalCommandDataConstructor extends CommandData {
    constructor() {
        super({
            name: 'eval',
            description: 'Evaluates a code.',
            aliases: ['pong'],
            config: {
                devOnly: true,
                registerSlash: true
            },
            options: [
                {
                    name: 'code',
                    description: 'Insira um código:',
                    required: true,
                    type: ApplicationCommandOptionType.String
                }
            ]
        });
    }
}

export const EvalCommandData = new EvalCommandDataConstructor();