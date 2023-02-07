import winston, { transports, format } from "winston";
import "winston-daily-rotate-file";

const logFormat = format.printf(({ level, message, timestamp }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`);

const logger = winston.createLogger({
  level: "info",
  format: format.combine(format.timestamp({ format: "D.M.YYYY HH.mm.ss" }), logFormat),
  defaultMeta: { service: "user-service" },
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      filename: "logs/%DATE%.log",
      datePattern: "DD-MM-YYYY",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d"
    })
  ]
});

export default logger;