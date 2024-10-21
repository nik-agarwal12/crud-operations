import winston from 'winston';

// Create logger instance
const logger = winston.createLogger({
    level: 'info',  // Log level (info, warn, error)
    format: winston.format.combine(
        winston.format.timestamp(),  // Include timestamps
        winston.format.json()        // JSON format for Azure Monitor
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),  // Error logs
        new winston.transports.File({ filename: 'logs/combined.log' }),  // All logs
        new winston.transports.Console()  // Log to the console as well
    ],
});

// Export the logger
export default logger;
