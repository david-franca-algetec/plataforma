export type BackEndInstitution = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  demands: any[];
};

export type IInstitution = Omit<BackEndInstitution, "demands">;
