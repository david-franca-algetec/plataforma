import { IDepartment } from "./department";
import { BackEndRole } from "./role";

export type BackEndUser = {
  id: number;
  email: string;
  role_id: number;
  department_id: number;
  name: string;
  remember_me_token: null;
  created_at: string;
  updated_at: string;
  role: BackEndRole;
  department: IDepartment;
};

export type FrontEndUser = Omit<BackEndUser, "role" | "department" | "remember_me_token">;

export type FrontEndUserCreate = {
  name: string;
  email: string;
  password: string;
  department_id: number;
  role_id: number;
};
