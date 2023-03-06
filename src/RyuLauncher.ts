import { Constants } from 'darkcord';
import { RyuDark } from './RyuClient';
import { config } from 'dotenv';
config({ path: './.env' });

new RyuDark(process.env.CLIENT_TOKEN as string, {
    gateway: {
        intents: [
            Constants.GatewayIntentBits.Guilds,
            Constants.GatewayIntentBits.GuildMembers,
            Constants.GatewayIntentBits.MessageContent,
            Constants.GatewayIntentBits.GuildMessages,
            Constants.GatewayIntentBits.GuildPresences
        ]
    },
    plugins: []
}).initialize();
