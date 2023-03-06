import { CommandStructure, CommandData } from '../../Structures';
import { RyuDark } from '../../RyuClient';
import { Message } from 'darkcord';
import { inspect } from 'node:util';

class EvalCommandData extends CommandData {
    constructor() {
        super({
            name: 'eval',
            description: 'Evaluates a code.',
            aliases: ['pong'],
            config: {
                devOnly: true,
                registerSlash: true
            }
        });
    }
}

export default class EvalCommand extends CommandStructure<RyuDark, EvalCommandData> {
    constructor(client: RyuDark) {
        super(client, new EvalCommandData());
    }

    async execute({ message, args }: { message: Message, args: string[] }): Promise<any> {
        const code = args.join(' ') ?? '';

        try {
            const result = await Promise.any([eval(code), Promise.reject()]);
            const evaled = inspect(result, { depth: 0 });

            message.reply({
                content: `\`\`\`js\n${evaled.slice(0, 1970)}\`\`\``
            });
        } catch (err: unknown) {
            message.reply({
                content: `\`\`\`js\n${(err as Error).message.slice(0, 2000)}\`\`\``
            });
        }
    }
}