export interface User {
  emp_id: number;
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  org_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface Organisation {
  org_id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  org_id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  proj_id: number;
}

export interface Role {
  role_id: number;
  name: string;
  org_id: number;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export interface Department {
  dept_id: number;
  name: string;
  org_id: number;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}
