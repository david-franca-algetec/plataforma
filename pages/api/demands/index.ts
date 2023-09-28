import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import { API_URL } from "src/constants";
import { sortArray } from "src/helpers/sortArray";
import { BackEndDemand } from "src/interfaces/demands";

export const getDemands = async (req: NextApiRequest, res: NextApiResponse, token: string) => {
  const { _order, _sort } = req.query;
  try {
    const response = await fetch(`${API_URL}/demands/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data: BackEndDemand[] = await response.json();

    if (response.ok) {
      return res.status(200).json(
        data
          .map((demand) => ({
            id: demand.id,
            experiment_id: demand.experiments.id,
            experiment_name: demand.experiments.name,
            institution_name: demand.institutions.name,
            tags: demand.demandTags.map((tag) => tag.name),
            status: demand.status,
            creator_name: demand.creator?.name,
            deadline: demand.finished_at,
            scripting: demand.latest_scripting_log?.demandLog_developers.map((el) => el.name).join(", ") || "",
            modeling: demand.latest_modeling_log?.demandLog_developers.map((el) => el.name).join(", ") || "",
            coding: demand.latest_coding_log?.demandLog_developers.map((el) => el.name).join(", ") || "",
            testing: demand.latest_testing_log?.demandLog_developers.map((el) => el.name).join(", ") || "",
            ualab: demand.latest_ualab_log?.demandLog_developers.map((el) => el.name).join(", ") || "",
            designing: demand.latest_designing_log?.demandLog_developers.map((el) => el.name).join(", ") || "",
          }))
          .sort((a, b) => sortArray(a, b, _sort as string, _order as string)),
      );
    }
    return res.status(400).json({ message: "Something went wrong" });
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
    return getDemands(req, res, token);
  }
  if (req.method === "POST") {
    // return createRoles(req, res, token);
  }
  return res.status(405).json({ message: "Method not allowed for this route" });
}
