import { Model } from "objection";
import User from "./user";
import Organisation from "./organisation";
import Comment from "./comment";
import Department from "./department";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const knex = require("../../knex");

Model.knex(knex);

class Ticket extends Model {
  title!: string;
  description!: string;
  status!: number;
  user_id!: number;
  org_id!: number;
  dept_id!: number;
  created_at!: Date;
  updated_at!: Date;

  static get tableName() {
    return "tickets";
  }

  static get idColumn() {
    return "ticket_id";
  }

  $beforeInsert(): void | Promise<any> {
    this.created_at = new Date();
    this.updated_at = new Date();
    this.status = 1;
  }

  $beforeUpdate(): void | Promise<any> {
    this.updated_at = new Date();
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        ticket_id: { type: "integer" },
        title: { type: "string" },
        description: { type: "string" },
        org_id: { type: "integer" },
        user_id: { type: "integer" },
        dept_id: { type: "integer" },
        status: { type: "integer" }
      }
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "tickets.user_id",
          to: "users.user_id"
        }
      },
      organisation: {
        relation: Model.BelongsToOneRelation,
        modelClass: Organisation,
        join: {
          from: "tickets.org_id",
          to: "organisations.org_id"
        }
      },
      comment: {
        relation: Model.HasManyRelation,
        modelClass: Comment,
        join: {
          from: "tickets.ticket_id",
          to: "comments.ticket_id"
        }
      },
      department: {
        relation: Model.BelongsToOneRelation,
        modelClass: Department,
        join: {
          from: "tickets.dept_id",
          to: "departments.dept_id"
        }
      }
    };
  }
}

export default Ticket;
