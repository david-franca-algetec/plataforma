import { BackEndDemandInstitution } from "./demands";

export type BackEndInstitution = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  demands: BackEndDemandInstitution[];
};

export type IInstitution = Omit<BackEndInstitution, "demands">;
