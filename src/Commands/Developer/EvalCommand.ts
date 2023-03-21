import { CommandStructure } from '../../Structures';
import { EvalCommandData } from '../../Data/Commands/Developer/EvalCommandData';
import { RyuDark } from '../../RyuClient';
import { Message } from 'darkcord';
import { inspect } from 'node:util';

export default class EvalCommand extends CommandStructure {
    constructor(client: RyuDark) {
        super(client, EvalCommandData);
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