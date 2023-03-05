import * as winston from 'winston';

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
                        error: 'yellow',
                        warn: 'yellow',
                        info: 'green',
                        debug: 'grey'
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

    public debug(message: string, meta?: any): void {
        this.logger.debug(message, meta);
    }

    public info(message: string, meta?: any): void {
        this.logger.info(message, meta);
    }

    public warn(message: string, meta?: any): void {
        this.logger.warn(message, meta);
    }

    public error(message: string, meta?: any): void {
        this.logger.error(message, meta);
    }
}

class Utils {
    public GetMention(id: string) {
        return new RegExp(`^<@!?${id}>( |)$`);
    }
}

export { Utils, Logger };
