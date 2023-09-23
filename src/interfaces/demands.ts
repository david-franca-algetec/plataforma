import { IInstitution } from "./institutions";

export enum DemandStatus {
  DEVELOPMENT = "Desenvolvimento",
  VALIDATION = "Validação",
  CORRECTION = "Correção",
  READY = "Pronto",
  REVALIDATION = "Revalidação",
}

export interface BackEndDemand {
  id: number;
  experiment_id: number;
  institution_id: number;
  status: DemandStatus;
  scripting: number;
  modeling: number;
  coding: number;
  testing: number;
  ualab: number;
  created_at: string;
  updated_at: string;
  finished_at: string;
  created_by_id?: string | null;
  designing: number;
  latest_scripting_log_id: number | null;
  latest_modeling_log_id: number | null;
  latest_coding_log_id: number | null;
  latest_testing_log_id: number | null;
  latest_ualab_log_id: number | null;
  latest_designing_log_id: number | null;
  institutions: IInstitution;
  // demandTags?: DemandTags[];
  // files: IFiles[];
  // latest_scripting_log: DemandLog | null;
  // latest_modeling_log: DemandLog | null;
  // latest_testing_log: DemandLog | null;
  // latest_designing_log: DemandLog | null;
  // experiments: ExperimentsWithIssues;
  // creator?: User;
  // latest_coding_log: DemandLog | null;
  // latest_ualab_log: DemandLog | null;
}
