import { ColumnRef, OrderByDirection, QueryBuilder } from "objection";
import User from "../models/user";
import Organisation from "../models/organisation";
import Ticket from "../models/ticket";

interface CreateQuery {
  query: QueryBuilder<
    User | Organisation | Ticket,
    User[] | Organisation[] | Ticket[]
  >;
  page: number;
  per_page: number;
  search: string;
  search_field: ColumnRef;
  sort_by: ColumnRef;
  sort_order: OrderByDirection;
}

const createQuery = (params: CreateQuery) => {
  const { query, page, per_page, search, search_field, sort_by, sort_order } =
    params;

  if (sort_by) {
    query?.orderBy(sort_by, sort_order);
  }

  if (page) {
    // ?BELOW QUERY WON'T PROVIDE total
    // const offset = (Number(page) - 1) * Number(per_page);
    // query?.limit(Number(per_page)).offset(offset);

    // ?Below query give extra object: results
    query?.page(Number(page) - 1, Number(per_page));
  }

  if (search) {
    query?.where(`${search_field!}`, "like", `%${search}%`);
  }

  return query;
};

export default createQuery;
