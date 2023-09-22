import type { NextApiRequest, NextApiResponse } from "next";
import { API_URL } from "src/constants";
import { IUser } from "./users";

export type ResponseLoginData = {
  token: {
    type: string;
    token: string;
  };
  user: IUser[];
};

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
