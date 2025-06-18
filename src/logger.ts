import { createLogger, format, transports, Logger } from 'winston';
import * as fs from 'fs';
import * as path from 'path';

// Use a local logs directory instead of /var/log to avoid permission issues
const logFilePath = path.join(process.cwd(), 'logs', 'nodeapp.log');

// Ensure the log directory exists and is writable
const logDir = path.dirname(logFilePath);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
try {
  fs.accessSync(logDir, fs.constants.W_OK);
} catch (err) {
  throw new Error(`Log directory is not writable: ${logDir}`);
}

const logger: Logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: logFilePath }),
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ],
  exitOnError: false,
});

export default logger; 