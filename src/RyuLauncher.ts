import { Constants } from 'darkcord';
import { RyuDark } from './RyuClient';
import { config } from 'dotenv';
config({ path: './.env' });

new RyuDark(process.env.CLIENT_TOKEN, {
    gateway: {
        intents: [
            Constants.GatewayIntentBits.Guilds,
            Constants.GatewayIntentBits.GuildMessages,
            Constants.GatewayIntentBits.MessageContent,
            Constants.GatewayIntentBits.GuildMembers
        ]
    },
    cache: {
        messageCacheLimitPerChannel: 10
    }
}).initialize();
