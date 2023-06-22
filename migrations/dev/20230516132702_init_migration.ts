import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("organisations", (table) => {
      table.increments("org_id").primary();
      table.string("name").notNullable();
      table.string("address").notNullable();
      table.string("city").notNullable();
      table.string("state").notNullable();
      table.string("country").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .then(() =>
      knex.schema.createTable("employees", (table) => {
        table.increments("emp_id").primary();
        table.string("first_name").notNullable();
        table.string("last_name").notNullable();
        table.string("password").notNullable();
        table.string("email").notNullable().unique();
        table
          .integer("org_id")
          .unsigned()
          .references("org_id")
          .inTable("organisations");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
      })
    );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users").then(() => {
    return knex.schema.dropTable("organisations");
  });
}
