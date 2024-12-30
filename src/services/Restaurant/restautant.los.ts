import winston from "winston";

export const Logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});
