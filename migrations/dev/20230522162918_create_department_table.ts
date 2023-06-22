import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("departments", (table) => {
      table.increments("dept_id").primary();
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
          .integer("dept_id")
          .unsigned()
          .references("dept_id")
          .inTable("departments");
      })
    );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("users", (table) => {
      table.dropColumn("dept_id");
    })
    .then(() => knex.schema.dropTable("departments"));
}
