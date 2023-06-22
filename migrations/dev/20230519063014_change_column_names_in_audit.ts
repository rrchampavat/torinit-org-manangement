import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("audit", (table) => {
    table.renameColumn("request_url", "req_url");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("audit", (table) => {
    table.renameColumn("req_url", "request_url");
  });
}
