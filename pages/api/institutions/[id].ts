import type { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import { API_URL } from "src/constants";
import { BackEndInstitution } from "src/interfaces/institutions";

export const getInstitution = async (req: NextApiRequest, res: NextApiResponse, token: string) => {
  const { id } = req.query;

  try {
    const response = await fetch(`${API_URL}/institutions/show/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data: BackEndInstitution[] = await response.json();
      res.status(200).json(
        data.map((institution) => ({
          id: institution.id,
          name: institution.name,
          created_at: institution.created_at,
          updated_at: institution.updated_at,
        }))[0],
      );
    } else {
      res.status(500).json({ message: "Invalid credentials!" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const updateInstitution = async (req: NextApiRequest, res: NextApiResponse, token: string) => {
  const { id } = req.query;
  const { name } = req.body;
  const body = {
    name,
  };

  try {
    const response = await fetch(`${API_URL}/institutions/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      res.status(200).json(data.data);
    } else {
      res.status(500).json({ message: "Invalid credentials!" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const deleteInstitution = async (req: NextApiRequest, res: NextApiResponse, token: string) => {
  const { id } = req.query;

  try {
    const response = await fetch(`${API_URL}/institutions/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      res.status(200).json(data.data);
    } else {
      res.status(500).json({ message: "Invalid credentials!" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = nookies.get({ req }).token;
  if (req.method === "GET") {
    return getInstitution(req, res, token);
  }
  if (req.method === "PATCH") {
    return updateInstitution(req, res, token);
  }
  if (req.method === "DELETE") {
    return deleteInstitution(req, res, token);
  }
  return res.status(405).json({ message: "Method not allowed" });
}
