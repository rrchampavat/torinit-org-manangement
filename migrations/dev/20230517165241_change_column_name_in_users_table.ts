import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("users", (table) => {
    table.renameColumn("emp_id", "user_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("users", (table) => {
    table.renameColumn("user_id", "emp_id");
  });
}
