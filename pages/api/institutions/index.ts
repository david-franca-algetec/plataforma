import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import { API_URL } from "src/constants";
import { Filter, filterArray } from "src/helpers/filterArray";
import { sortArray } from "src/helpers/sortArray";
import { BackEndInstitution, IInstitution } from "src/interfaces/institutions";

interface ResponseData {
  message: string;
  data?: IInstitution[];
}

export const getInstitutions = async (req: NextApiRequest, res: NextApiResponse, token: string) => {
  const { _order, _sort, name_like } = req.query;

  const filters: Filter[] = [{ key: "name", value: name_like }];

  try {
    const response = await fetch(`${API_URL}/institutions/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data: BackEndInstitution[] = await response.json();

      res.status(200).json(
        filterArray(
          data
            .map((institution) => ({
              id: institution.id,
              name: institution.name,
              created_at: institution.created_at,
              updated_at: institution.updated_at,
            }))
            .sort((a, b) => sortArray(a, b, _sort as string, _order as string)),
          filters
        )
      );
    } else {
      res.status(500).json({ message: "Invalid credentials!" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const createInstitution = async (req: NextApiRequest, res: NextApiResponse, token: string) => {
  const { name } = req.body;
  const body = {
    name,
  };

  try {
    const response = await fetch(`${API_URL}/institutions/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data: BackEndInstitution = await response.json();
      res.status(200).json({
        id: data.id,
        name: data.name,
        created_at: data.created_at,
        updated_at: data.updated_at,
      });
    } else {
      res.status(500).json({ message: "Invalid credentials!" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const token = nookies.get({ req }).token;

  if (req.method === "GET") {
    return getInstitutions(req, res, token);
  }
  if (req.method === "POST") {
    return createInstitution(req, res, token);
  }
  return res.status(405).json({ message: "Method not allowed" });
}
