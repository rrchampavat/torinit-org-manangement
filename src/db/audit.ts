import Error from "../models/error";
import logger from "../utils/logger";

interface LogError {
  message: string;
  module: string;
  req_url: string;
  req_method: string;
  req_host?: string;
  user_id?: number;
}

const logError = async (params: LogError) => {
  const { message, module, user_id, req_url, req_method, req_host } = params;
  try {
    await Error.query().insert({
      message: message,
      module: module,
      req_url: req_url,
      req_method: req_method,
      req_host: req_host,
      user_id: user_id
    });
  } catch (error: any) {
    logger.error(error?.message);
  }
};

export default logError;
