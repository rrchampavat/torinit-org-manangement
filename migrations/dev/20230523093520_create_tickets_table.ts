import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tickets", (table) => {
    table.increments("ticket_id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .notNullable();
    table
      .integer("org_id")
      .unsigned()
      .references("org_id")
      .inTable("organisations")
      .notNullable();
    table.enum("status", [1, 2, 3]);
    table.string("title").notNullable();
    table.string("description").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("tickets");
}
