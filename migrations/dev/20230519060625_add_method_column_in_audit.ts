import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("audit", (table) => {
    table.string("req_method");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("audit", (table) => {
    table.dropColumn("req_method");
  });
}
