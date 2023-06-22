import { Model } from "objection";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const knex = require("../../knex");

import Organisation from "./organisation";
import Role from "./role";
import Project from "./project";
import Department from "./department";
import Ticket from "./ticket";

Model.knex(knex);

class User extends Model {
  first_name!: string;
  last_name!: string;
  password!: string;
  email!: string;
  org_id!: number | null;
  proj_id!: number | null;
  role_id!: number;
  dept_id!: number;
  created_at!: Date;
  updated_at!: Date;
  is_active!: boolean;

  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "user_id";
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
        user_id: { type: "integer" },
        first_name: { type: "string", minLength: 3 },
        last_name: { type: "string", minLength: 3 },
        password: { type: "string", minLength: 8 },
        email: { type: "string" },
        org_id: { type: "integer" },
        role_id: { type: "integer" },
        dept_id: { type: "integer" },
        is_active: { type: "boolean" }
      }
    };
  }

  static get relationMappings() {
    return {
      organisation: {
        relation: Model.BelongsToOneRelation,
        modelClass: Organisation,
        join: {
          from: "users.org_id",
          to: "organisations.org_id"
        }
      },
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: "users.role_id",
          to: "roles.role_id"
        }
      },
      project: {
        relation: Model.BelongsToOneRelation,
        modelClass: Project,
        join: {
          from: "users.proj_id",
          to: "projects.proj_id"
        }
      },
      department: {
        relation: Model.BelongsToOneRelation,
        modelClass: Department,
        join: {
          from: "users.dept_id",
          to: "departments.dept_id"
        }
      },
      ticket: {
        relation: Model.BelongsToOneRelation,
        modelClass: Ticket,
        join: {
          from: "users.user_id",
          to: "tickets.user_id"
        }
      }
    };
  }
}

export default User;
