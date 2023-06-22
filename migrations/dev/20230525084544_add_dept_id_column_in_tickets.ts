import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("tickets", (table) => {
    table
      .integer("dept_id")
      .unsigned()
      .references("dept_id")
      .inTable("departments");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("tickets", (table) => {
    table.dropColumn("dept_id");
  });
}
