import { log } from "console";
import type { NextApiRequest, NextApiResponse } from "next";

export type IUser = {
  id: number;
  email: string;
  role_id: number;
  department_id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type ResponseLoginData = {
  token: {
    type: string;
    token: string;
  };
  user: IUser[];
};

const API_URL = "https://plataforma-algetec-back-dev.grupoa.education/api";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check the email and password match
  const { email, password } = req.body;
  const body = {
    email,
    password,
  };
  fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then(async (response) => {
      const data: ResponseLoginData = await response.json();
      if (response.ok) {
        log(data);
        res.status(200).json(data);
      } else {
        // Handle error
        res.status(500).json({ message: "Invalid credentials!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
}
