import { Model } from "objection";
import Ticket from "./ticket";
import User from "./user";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const knex = require("../../knex");

Model.knex(knex);

class Comment extends Model {
  user_id!: number;
  ticket_id!: number;
  message!: string;
  created_at!: Date;
  updated_at!: Date;

  static get tableName() {
    return "comments";
  }

  static get idColumn() {
    return "cmt_id";
  }

  $beforeInsert(): void | Promise<any> {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  $beforeUpdate(): void | Promise<any> {
    this.updated_at = new Date();
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        cmt_id: { type: "integer" },
        user_id: { type: "integer" },
        ticket_id: { type: "integer" },
        message: { type: "string", minLength: 2 }
      }
    };
  }

  static get relationMappings() {
    return {
      ticket: {
        relation: Model.BelongsToOneRelation,
        modelClass: Ticket,
        join: {
          from: "comments.ticket_id",
          to: "tickets.ticket_id"
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "comments.user_id",
          to: "users.user_id"
        }
      }
    };
  }
}

export default Comment;
