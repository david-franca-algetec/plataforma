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

export type IUser = {
  id: number;
  email: string;
  role_id: number;
  department_id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type IUserCreate = {
  name: string;
  email: string;
  password: string;
  department_id: number;
  role_id: number;
};
