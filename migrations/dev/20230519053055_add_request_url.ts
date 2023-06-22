import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("audit", (table) => {
    table.string("request_url");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("audit", (table) => {
    table.dropColumn("request_url");
  });
}
