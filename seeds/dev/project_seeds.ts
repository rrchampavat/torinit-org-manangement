import { Knex } from "knex";
import { createRandomProject } from "../../src/utils/faker";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("projects").del();

  const projects: Array<any> = [];

  for (let i = 1; i <= 50; i++) {
    const proj = createRandomProject();

    proj["proj_id"] = i;

    projects.push(proj);
  }

  // Inserts seed entries
  await knex("projects").insert(projects);
}
