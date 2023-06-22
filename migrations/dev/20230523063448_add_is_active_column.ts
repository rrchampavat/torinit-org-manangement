import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("roles", (table) => {
      table.boolean("is_active").defaultTo(true);
    })
    .then(() =>
      knex.schema.alterTable("departments", (table) => {
        table.boolean("is_active").defaultTo(true);
      })
    )
    .then(() =>
      knex.schema.alterTable("projects", (table) => {
        table.boolean("is_active").defaultTo(true);
      })
    );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("roles", (table) => {
      table.dropColumn("is_active");
    })
    .then(() =>
      knex.schema.alterTable("departments", (table) => {
        table.dropColumn("is_active");
      })
    )
    .then(() =>
      knex.schema.alterTable("projects", (table) => {
        table.dropColumn("is_active");
      })
    );
}
