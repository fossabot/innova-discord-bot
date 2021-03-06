import fs = require('fs');

const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

// import { botName } from '../../config/settings.js';

const logDir = 'log';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFormat = format.printf(log => {
  return `${log.timestamp} ${log.label}|${log.level}: ${log.message}`;
});

const transportsData = {
  console: new transports.Console({
    level: 'info',
    timestamp: true,
    format: format.combine(
      format.timestamp({
        format: 'DD-MM-YY HH:mm:ss'
      }),
      format.label({ label: 'InnovaBot' }),
      format.colorize({ all: true }),
      logFormat,
    )
  }),
  file: new transports.DailyRotateFile({
    filename: `${logDir}/%DATE%.log`,
    datePattern: 'DD-MM-YYYY',
    level: 'debug',
  })
};

const logger = createLogger({
  transports: [
    transportsData.console,
    transportsData.file
  ]
});

export const logInfo = (text: string, data?: any) => logger
  .log('info', text, data ? data : undefined);
export const logWarn = (text: string, data?: any) => logger
  .log('warn', text, data ? data : undefined);
export const logError = (text: string, data?: any) => logger
  .log('error', text, data ? data : undefined);
export const logDebug = (text: string, data?: any) => logger
  .log('debug', text, data ? data : undefined);
export const logVerbose = (text: string, data?: any) => logger
  .log('verbose', text, data ? data : undefined);

export const setLogLevel = (level: string) => {
  // Object.keys(transports).forEach(key => transports[key].level = level);
  transportsData.console.level = level;
  logInfo('Log level set to ' + level);
};