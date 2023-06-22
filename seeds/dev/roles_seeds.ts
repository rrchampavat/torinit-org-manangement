import { Knex } from "knex";
import { createRandomRole } from "../../src/utils/faker";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  // await knex("roles").del();

  const roles: Array<any> = [];

  for (let i = 1; i <= 50; i++) {
    const role = createRandomRole();

    role["role_id"] = i;

    roles.push(role);
  }

  // Inserts seed entries
  await knex("roles").insert(roles);
}
