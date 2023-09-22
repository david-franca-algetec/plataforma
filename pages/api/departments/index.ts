import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import { API_URL } from "src/constants";
import { handleDepartmentName } from "src/helpers/handleDepartmentName";
import { IDepartment } from "src/interfaces/department";

export const getDepartments = async (_req: NextApiRequest, res: NextApiResponse, token: string) => {
  try {
    const response = await fetch(`${API_URL}/departments/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data: IDepartment[] = await response.json();

    if (response.ok) {
      return res.status(200).json(
        data.map((department) => ({
          ...department,
          name: handleDepartmentName(department.name),
        }))
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = nookies.get({ req }).token;

  if (req.method === "GET") {
    return getDepartments(req, res, token);
  }
  if (req.method === "POST") {
    // return createRoles(req, res, token);
  }
  return res.status(405).json({ message: "Method not allowed" });
}
