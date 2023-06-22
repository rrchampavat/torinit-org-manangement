import { Knex } from "knex";

import { createRandomOrg } from "../../src/utils/faker";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("organisations").del();

  const organisations: Array<any> = [];

  for (let i = 1; i <= 10; i++) {
    const org = createRandomOrg();

    org["org_id"] = i;

    organisations.push(org);
  }

  // Inserts seed entries
  await knex("organisations").insert(organisations);
}
