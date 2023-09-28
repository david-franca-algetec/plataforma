import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import { API_URL } from "src/constants";
import { Filter, filterArray } from "src/helpers/filterArray";
import { handleDepartmentName } from "src/helpers/handleDepartmentName";
import { sortArray } from "src/helpers/sortArray";
import { BackEndUser, FrontEndUserCreate } from "src/interfaces/user";

export type ResponseUser = Omit<
  BackEndUser,
  "role" | "department" | "role_id" | "department_id" | "remember_me_token"
> & {
  role: string;
  department: string;
};

export const getUsers = async (req: NextApiRequest, res: NextApiResponse, token: string) => {
  const { _order, _sort, role, department, email_like, name_like } = req.query;

  const filters: Filter[] = [
    { key: "role", value: role },
    { key: "department", value: department },
    { key: "email", value: email_like },
    { key: "name", value: name_like },
  ];

  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: BackEndUser[] = await response.json();

    if (response.ok) {
      return res.status(200).json(
        filterArray(
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
            .sort((a, b) => sortArray(a, b, _sort as string, _order as string)),
          filters
        )
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

  const body: FrontEndUserCreate = {
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = nookies.get({ req }).token;

  if (req.method === "GET") {
    return getUsers(req, res, token);
  }
  if (req.method === "POST") {
    return createUser(req, res, token);
  }
  return res.status(405).json({ message: "Method not allowed" });
}
