import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("audit", (table) => {
    table.increments("error_id").primary();
    table.string("message");
    table.string("module");
    table.integer("user_id").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("audit");
}
