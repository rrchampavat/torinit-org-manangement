import winston from "winston";

const logger = winston.createLogger({
  level: "info", //Sets the default level
  format: winston.format.json(), //Sets the default format
  //   defaultMeta: { service: "user-service" }, //Adds extra meta-data
  transports: [
    //Configures the transports, or essentially where do log messages go...
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: "error.log", level: "error" }) //Error log files for error-level logs
  ]
});

logger.add(
  new winston.transports.Console({
    format: winston.format.simple()
  })
);

export default logger;
