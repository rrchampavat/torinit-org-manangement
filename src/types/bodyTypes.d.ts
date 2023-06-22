interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  orgID: number | null;
}

interface RegisterWithOrg {
  user: RegisterBody;
  organisation: CreateOrgBody;
}

interface CreateOrgBody {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

interface UserUpdateBody {
  firstName: string;
  lastName: string;
  email: string;
  orgID: number | null;
}

interface CreateTicketBody {
  title: string;
  description: string;
  dept_id: number;
}

interface ChangeTicketStatusBody {
  status: 1 | 2 | 3 | 4;
}
