import { Model } from "objection";
import User from "./user";
import Organisation from "./organisation";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const knex = require("../../knex");

Model.knex(knex);

class Project extends Model {
  name!: string;
  org_id!: number;
  created_at!: Date;
  updated_at!: Date;
  is_active!: boolean;

  static get tableName() {
    return "projects";
  }

  static get idColumn() {
    return "proj_id";
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
        proj_id: { type: "integer" },
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
          from: "projects.proj_id",
          to: "users.proj_id"
        }
      },
      organisation: {
        relation: Model.BelongsToOneRelation,
        modelClass: Organisation,
        join: {
          from: "roles.org_id",
          to: "organisations.org_id"
        }
      }
    };
  }
}

export default Project;
