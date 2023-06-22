import { Model } from "objection";
import User from "./user";
import Organisation from "./organisation";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const knex = require("../../knex");

Model.knex(knex);

class Department extends Model {
  name!: string;
  org_id!: number;
  created_at!: Date;
  updated_at!: Date;
  is_active!: boolean;

  static get tableName() {
    return "departments";
  }

  static get idColumn() {
    return "dept_id";
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
        dept_id: { type: "integer" },
        name: { type: "string" },
        org_id: { type: "integer" },
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
          from: "departments.dept_id",
          to: "users.dept_id"
        }
      },
      organisation: {
        relation: Model.BelongsToOneRelation,
        modelClass: Organisation,
        join: {
          from: "departments.org_id",
          to: "organisations.org_id"
        }
      }
    };
  }
}

export default Department;
