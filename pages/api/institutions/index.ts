import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import { API_URL } from "src/constants";

export type Institution = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  demands: any[];
};

export type IInstitution = Omit<Institution, "demands">;

interface ResponseData {
  message: string;
  data?: IInstitution[];
}

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

export const getInstitutions = (req: NextApiRequest, res: NextApiResponse, token: string) => {
  const { _order, _sort, name_like } = req.query;

  fetch(`${API_URL}/institutions/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then(async (response) => {
      const data: Institution[] = await response.json();
      if (response.ok) {
        res.status(200).json(
          data
            .map((institution) => ({
              id: institution.id,
              name: institution.name,
              created_at: institution.created_at,
              updated_at: institution.updated_at,
            }))
            .sort((a, b) => {
              const sort = _sort as keyof IInstitution;
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
            .filter((institution) => {
              if (name_like) {
                return institution.name.toLowerCase().includes(name_like.toString().toLowerCase());
              }
              return true;
            }),
        );
      } else {
        // Handle error
        res.status(500).json({ message: "Invalid credentials!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
};

export const createInstitution = (req: NextApiRequest, res: NextApiResponse, token: string) => {
  const { name } = req.body;
  const body = {
    name,
  };
  fetch(`${API_URL}/institutions/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(body),
  })
    .then(async (response) => {
      const data: Institution = await response.json();
      if (response.ok) {
        res.status(200).json(data);
      } else {
        // Handle error
        res.status(500).json({ message: "Invalid credentials!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
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
