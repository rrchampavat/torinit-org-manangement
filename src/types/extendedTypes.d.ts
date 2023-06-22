import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { AnyQueryBuilder, ColumnRef, OrderByDirection } from "objection";

interface RequestUser {
  user_id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  org_id?: number | null;
  proj_id?: number | null;
  dept_id?: number;
  role_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface CustomRequest extends Request {
  user?: RequestUser;
}

interface DecodedJWT extends JwtPayload {
  user_id?: number | string;
}

interface RequestParams extends ParamsDictionary {
  id?: number;
}

interface ReqQuery extends QueryString.ParsedQs {
  page?: string;
  per_page?: string;
  sort_by?: ColumnRef;
  sort_order?: OrderByDirection;
  search?: string;
  search_field?: ColumnRef;
}
