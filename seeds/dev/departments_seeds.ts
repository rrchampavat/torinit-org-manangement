import { Knex } from "knex";
import { createRandomDepartment } from "../../src/utils/faker";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  // await knex("departments").del();

  const departments: Array<any> = [];

  for (let i = 1; i <= 50; i++) {
    const department = createRandomDepartment();

    department["dept_id"] = i;

    departments.push(department);
  }

  // Inserts seed entries
  await knex("departments").insert(departments);
}
