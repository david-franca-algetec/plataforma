import type { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import type { Institution } from ".";

const API_URL = "https://plataforma-algetec-back-dev.grupoa.education/api";

export const getInstitution = async (req: NextApiRequest, res: NextApiResponse, token: string) => {
  const { id } = req.query;

  const response = await fetch(`${API_URL}/institutions/show/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const data: Institution[] = await response.json();
  if (response.ok) {
    res.status(200).json(
      data.map((institution) => ({
        id: institution.id,
        name: institution.name,
        created_at: institution.created_at,
        updated_at: institution.updated_at,
      }))[0],
    );
  } else {
    // Handle error
    res.status(500).json({ message: "Invalid credentials!" });
  }
};

export const updateInstitution = async (req: NextApiRequest, res: NextApiResponse, token: string) => {
  const { id } = req.query;
  const { name } = req.body;
  const body = {
    name,
  };
  fetch(`${API_URL}/institutions/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(body),
  })
    .then(async (response) => {
      const data = await response.json();
      if (response.ok) {
        res.status(200).json(data.data);
      } else {
        // Handle error
        res.status(500).json({ message: "Invalid credentials!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
};

export const deleteInstitution = async (req: NextApiRequest, res: NextApiResponse, token: string) => {
  const { id } = req.query;
  fetch(`${API_URL}/institutions/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then(async (response) => {
      const data = await response.json();
      if (response.ok) {
        res.status(200).json(data.data);
      } else {
        // Handle error
        res.status(500).json({ message: "Invalid credentials!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = nookies.get({ req: req }).token;
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
