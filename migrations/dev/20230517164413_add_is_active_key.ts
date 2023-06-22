import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("organisations", (table) => {
      table.boolean("is_active").defaultTo(true);
    })
    .then(() =>
      knex.schema.alterTable("employees", (table) => {
        table.boolean("is_active").defaultTo(true);
      })
    );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("organisations", function (table) {
      table.dropColumn("is_active");
    })
    .then(() =>
      knex.schema.alterTable("employees", (table) => {
        table.dropColumn("is_active");
      })
    );
}
