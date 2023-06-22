import { Model } from "objection";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const knex = require("../../knex");

Model.knex(knex);

class Error extends Model {
  module!: string;
  message!: string;
  req_url!: string;
  req_method!: string;
  req_host!: string;
  created_at!: Date;
  user_id!: number;

  static get tableName() {
    return "audit";
  }

  static get idColumn() {
    return "error_id";
  }

  $beforeInsert(): void | Promise<any> {
    this.created_at = new Date();
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        error_id: { type: "integer" },
        module: { type: "string" },
        message: { type: "string" },
        request_url: { type: "string" },
        req_method: { type: "string" },
        req_host: { type: "string" },
        user_id: { type: "integer" }
      }
    };
  }
}

export default Error;
