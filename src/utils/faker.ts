import { faker } from "@faker-js/faker";

export const createRandomOrg = () => {
  return {
    org_id: 0,
    name: faker.company.name(),
    address: faker.location.streetAddress({ useFullAddress: true }),
    city: faker.location.city(),
    state: faker.location.state(),
    country: faker.location.country(),
    created_at: faker.date.past(),
    updated_at: faker.date.past()
  };
};

export const createRandomUser = () => {
  return {
    user_id: 0,
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    password: "$2a$10$TaIgAoFBUut0vnXUlrrr1uTL/f2xzr30YQ6Izjf5M1ojsG6PzUIA6",
    org_id: faker.number.int({
      min: 1,
      max: 10
    }),
    created_at: faker.date.past(),
    updated_at: faker.date.past(),
    email: "temp@gmail.com"
  };
};

export const createRandomProject = () => {
  return {
    proj_id: 0,
    name: faker.word.noun(),
    org_id: faker.number.int({ min: 1, max: 10 }),
    created_at: faker.date.recent({ days: 120 }),
    updated_at: faker.date.recent({ days: 120 }),
    is_active: true
  };
};

const roleNames = [
  "Frontend Dev",
  "Project Manager",
  "HR",
  "Full Stack Dev",
  "QA",
  "Admin"
];

export const createRandomRole = () => {
  return {
    role_id: 0,
    name: roleNames[Math.floor(Math.random() * roleNames.length)],
    org_id: faker.number.int({ min: 1, max: 10 }),
    created_at: faker.date.recent({ days: 120 }),
    updated_at: faker.date.recent({ days: 120 }),
    is_active: true
  };
};

const deptNames = ["HR", "Admin", "Tech", "Networking"];

export const createRandomDepartment = () => {
  return {
    dept_id: 0,
    name: deptNames[Math.floor(Math.random() * deptNames.length)],
    org_id: faker.number.int({ min: 1, max: 10 }),
    created_at: faker.date.recent({ days: 120 }),
    updated_at: faker.date.recent({ days: 120 }),
    is_active: true
  };
};
