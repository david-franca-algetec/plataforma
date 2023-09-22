import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import { API_URL } from "src/constants";
import { handleDepartmentName } from "src/helpers/handleDepartmentName";

type ICreateUser = {
  name: string;
  email: string;
  password: string;
  department_id: number;
  role_id: number;
};

type Role = {
  admin: boolean;
  assets: boolean;
  checklists: boolean;
  created_at: string;
  demands: boolean;
  demands_admin: boolean;
  demands_leader: boolean;
  id: number;
  issues: true;
  name: string;
  releases: boolean;
  super_admin: boolean;
  updated_at: string;
};

type Department = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type IUser = {
  id: number;
  email: string;
  role_id: number;
  department_id: number;
  name: string;
  remember_me_token: null;
  created_at: string;
  updated_at: string;
  role: Role;
  department: Department;
};

export type ResponseUser = Omit<IUser, "role" | "department" | "role_id" | "department_id" | "remember_me_token"> & {
  role: string;
  department: string;
};

function isDateValid(dateStr: string | number) {
  try {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  } catch (e) {
    return false;
  }
}

function sortByDate(a: string | number, b: string | number) {
  const dayA = new Date(a).getTime();
  const dayB = new Date(b).getTime();

  if (dayA > dayB) {
    return 1;
  }
  if (dayA < dayB) {
    return -1;
  }
  return 0;
}

export const getUsers = async (req: NextApiRequest, res: NextApiResponse, token: string) => {
  const { _order, _sort } = req.query;
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: IUser[] = await response.json();

    if (response.ok) {
      return res.status(200).json(
        data
          .map((user) => ({
            id: user.id,
            email: user.email,
            role: user.role.name,
            department: handleDepartmentName(user.department.name),
            name: user.name,
            created_at: user.created_at,
            updated_at: user.updated_at,
          }))
          .sort((a, b) => {
            const sort = _sort as keyof ResponseUser;
            const aField = a[sort];
            const bField = b[sort];

            if (isDateValid(aField) && isDateValid(bField)) {
              if (_order === "asc") {
                return sortByDate(aField, bField);
              }
              if (_order === "desc") {
                return sortByDate(bField, aField);
              }
            }
            if (typeof aField === "number" && typeof bField === "number") {
              if (_order === "asc") {
                return aField > bField ? 1 : -1;
              }
              if (_order === "desc") {
                return bField > aField ? 1 : -1;
              }
            }
            if (typeof aField === "string" && typeof bField === "string") {
              if (_order === "asc") {
                return aField.localeCompare(bField);
              }
              if (_order === "desc") {
                return bField.localeCompare(aField);
              }
            }

            return 0;
          })
      );
    } else {
      return res.status(500).json({ message: "Invalid credentials!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const createUser = async (req: NextApiRequest, res: NextApiResponse, token: string) => {
  const { name, email, password, department_id, role_id } = req.body;
  console.log(req.body);

  const body: ICreateUser = {
    name,
    email,
    password,
    department_id,
    role_id,
  };

  try {
    const response = await fetch(`${API_URL}/users/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      return res.status(200).json(data);
    }
    return res.status(500).json({ message: "Invalid credentials!" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = nookies.get({ req }).token;

  if (req.method === "GET") {
    return getUsers(req, res, token);
  }
  if (req.method === "POST") {
    return createUser(req, res, token);
  }
  return res.status(405).json({ message: "Method not allowed" });
}
