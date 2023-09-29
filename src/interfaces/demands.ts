import { IInstitution } from "./institutions";
import { BackEndUser, FrontEndUser } from "./user";

export enum DemandStatus {
  DEVELOPMENT = "Desenvolvimento",
  VALIDATION = "Validação",
  CORRECTION = "Correção",
  READY = "Pronto",
  REVALIDATION = "Revalidação",
}

export interface BackEndDemandInstitution {
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
  created_by_id: number;
  designing: number;
  latest_scripting_log_id?: number;
  latest_modeling_log_id?: number;
  latest_coding_log_id?: number;
  latest_testing_log_id?: number;
  latest_ualab_log_id?: number;
  latest_designing_log_id: number;
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
  created_by_id: number;
  designing: number;
  latest_scripting_log_id?: number;
  latest_modeling_log_id?: number;
  latest_coding_log_id?: number;
  latest_testing_log_id?: number;
  latest_ualab_log_id?: number;
  latest_designing_log_id?: number;
  institutions: IInstitution;
  latest_designing_log?: LatestLog;
  creator: Creator;
  experiments: Experiments;
  demandTags: DemandTag[];
  files: File[];
  latest_modeling_log?: LatestLog;
  latest_scripting_log?: LatestLog;
  latest_testing_log?: LatestLog;
  latest_coding_log?: LatestLog;
  latest_ualab_log?: LatestLog;
}

export type BackEndCreator = Omit<BackEndUser, "role">;

export type Creator = FrontEndUser & {
  department: Department;
};

export interface Department {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  checklist_id?: number;
}

export interface Experiments {
  id: number;
  field_id: number;
  original_experiment_id?: number;
  name: string;
  description?: string;
  image?: string;
  test?: string;
  web: boolean;
  pt: boolean;
  en: boolean;
  es: boolean;
  android: boolean;
  ios: boolean;
  status: number;
  created_at: string;
  updated_at: string;
  approved: boolean;
  field: Field;
}

export interface Field {
  id: number;
  category: string;
  name: string;
  language: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DemandTag {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface File {
  id: number;
  demand_id: number;
  department_id: number;
  user_id: number;
  link: string;
  created_at: string;
  updated_at: string;
  name: string;
  department: Department;
  user: FrontEndUser;
}

export interface LatestLog {
  id: number;
  demand_id: number;
  logger_id: number;
  type: string;
  progress: number;
  deadline: number;
  started_at: string;
  finished_at: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  checklist_id?: number;
  logger: Logger; // FrontEndUser
  demandLog_developers: DemandLogDeveloper[]; // FrontEndUser[]
  checklist?: Checklist;
}

export type Logger = FrontEndUser;

export type DemandLogDeveloper = FrontEndUser;

export interface Checklist {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  demand_checklist_parameters: DemandChecklistParameter[];
}

export interface DemandChecklistParameter {
  id: number;
  checklist_id: number;
  original_parameter_id: any;
  name: string;
  percentage: number;
  checked: boolean;
  created_at: string;
  updated_at: string;
  order?: number;
  demand_checklist_parameters: any[];
}

export interface FrontEndDemand {
  id: number;
  experiment_id: number;
  experiment_name: string;
  institution_name: string;
  tags: string[];
  status: DemandStatus;
  creator_name: string;
  deadline: string;
  scripting: string;
  modeling: string;
  coding: string;
  testing: string;
  ualab: string;
  designing: string;
}
