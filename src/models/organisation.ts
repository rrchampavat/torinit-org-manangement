import { Model } from "objection";
import User from "./user";
import Role from "./role";
import Department from "./department";
import Project from "./project";
import Ticket from "./ticket";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const knex = require("../../knex");

Model.knex(knex);

class Organisation extends Model {
  name!: string;
  address!: string;
  city!: string;
  state!: string;
  country!: string;
  created_at!: Date;
  updated_at!: Date;
  is_active!: boolean;

  static get tableName() {
    return "organisations";
  }

  static get idColumn() {
    return "org_id";
  }

  $beforeInsert(): void | Promise<any> {
    this.created_at = new Date();
    this.updated_at = new Date();
    this.is_active = true;
  }

  $beforeUpdate(): void | Promise<any> {
    this.updated_at = new Date();
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        org_id: { type: "integer" },
        name: { type: "string" },
        address: { type: "string" },
        city: { type: "string" },
        state: { type: "string" },
        country: { type: "string" },
        is_active: { type: "boolean" }
      }
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: "organisations.org_id",
          to: "users.org_id"
        }
      },
      role: {
        relation: Model.HasManyRelation,
        modelClass: Role,
        join: {
          from: "organisations.org_id",
          to: "roles.org_id"
        }
      },
      department: {
        relation: Model.HasManyRelation,
        modelClass: Department,
        join: {
          from: "organisations.org_id",
          to: "departments.org_id"
        }
      },
      project: {
        relation: Model.HasManyRelation,
        modelClass: Project,
        join: {
          from: "organisations.org_id",
          to: "projects.org_id"
        }
      },
      ticket: {
        relation: Model.HasManyRelation,
        modelClass: Ticket,
        join: {
          from: "organisations.org_id",
          to: "tickets.org_id"
        }
      }
    };
  }
}

export default Organisation;
