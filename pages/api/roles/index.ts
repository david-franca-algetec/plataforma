import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import { API_URL } from "src/constants";
import { IRole } from "src/interfaces/role";

export const getRoles = async (_req: NextApiRequest, res: NextApiResponse, token: string) => {
  try {
    const response = await fetch(`${API_URL}/roles/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data: IRole[] = await response.json();

    if (response.ok) {
      return res.status(200).json(data);
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = nookies.get({ req }).token;

  if (req.method === "GET") {
    return getRoles(req, res, token);
  }
  if (req.method === "POST") {
    // return createRoles(req, res, token);
  }
  return res.status(405).json({ message: "Method not allowed" });
}
