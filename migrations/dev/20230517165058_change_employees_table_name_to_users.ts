import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.renameTable("employees", "users");
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.renameTable("users", "employees");
}
