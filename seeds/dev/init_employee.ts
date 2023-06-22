import { Knex } from "knex";
import { createRandomUser } from "../../src/utils/faker";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  //   await knex("users").del();

  const users: Array<any> = [];

  for (let i = 1; i <= 100; i++) {
    const user = createRandomUser();

    user["user_id"] = i;
    user["email"] = `${user.first_name}.${user.last_name}${i}@gmail.com`;

    users.push(user);
  }

  // Inserts seed entries
  await knex("users").insert(users);
}
