import type { NextApiRequest, NextApiResponse } from "next";
import { API_URL } from "src/constants";
import nookies from "nookies";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = nookies.get({ req }).token;

  fetch(`${API_URL}/logout`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (response) => {
      const data = await response.json();
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
