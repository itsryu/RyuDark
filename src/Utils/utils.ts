import { ServiceStructure } from '../Structures';
import * as winston from 'winston';
import { setTimeout as sleep } from 'timers/promises';

export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}

class Logger {
    private logger: winston.Logger;

    constructor(private level: LogLevel = LogLevel.INFO, private environment: string = 'production') {
        this.logger = winston.createLogger({
            level: this.level,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.splat(),
                winston.format.json(),
                winston.format.colorize({
                    colors: {
                        error: 'red',
                        warn: 'yellow',
                        info: 'green',
                        debug: 'blue'
                    }
                }),
                winston.format.printf((info) => {
                    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
                    return `[${timestamp}] [${info.level}] [${info.environment}] ${info.message}`;
                })
            ),
            defaultMeta: { environment: this.environment },
            transports: [
                new winston.transports.Console()
            ]
        });
    }

    public debug(message: string, meta?: string): void {
        this.logger.debug(message, meta);
    }

    public info(message: string, meta?: string): void {
        this.logger.info(message, meta);
    }

    public warn(message: string, meta?: string): void {
        this.logger.warn(message, meta);
    }

    public error(message: string, meta?: string): void {
        this.logger.error(message, meta);
    }
}

class Utils {
    public GetMention(id: string): RegExp {
        return new RegExp(`^<@!?${id}>( |)$`);
    }

    public async executeService(service: ServiceStructure) {
        const { amount = 1, interval = 0, wait = 0 } = service.options;

        for (let i = 0; i < amount; i++) {
            await sleep(wait);
            service.serviceExecute();
            if (i < amount - 1) {
                await sleep(interval);
            }
        }
    }
}

export { Utils, Logger };
