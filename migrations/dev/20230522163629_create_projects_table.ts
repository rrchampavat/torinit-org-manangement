import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("projects", (table) => {
      table.increments("proj_id").primary();
      table.string("name");
      table
        .integer("org_id")
        .unsigned()
        .references("org_id")
        .inTable("organisations");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .then(() =>
      knex.schema.alterTable("users", (table) => {
        table
          .integer("proj_id")
          .unsigned()
          .references("proj_id")
          .inTable("projects");
      })
    );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("users", (table) => {
      table.dropColumn("proj_id");
    })
    .then(() => knex.schema.dropTable("projects"));
}
