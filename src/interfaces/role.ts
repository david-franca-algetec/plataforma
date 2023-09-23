import { IUser } from "./user";

export type BackEndRole = {
  admin: boolean;
  assets: boolean;
  checklists: boolean;
  created_at: string;
  demands: boolean;
  demands_admin: boolean;
  demands_leader: boolean;
  id: number;
  issues: true;
  name: string;
  releases: boolean;
  super_admin: boolean;
  updated_at: string;
};

export type IRole = {
  admin: boolean;
  assets: boolean;
  checklists: boolean;
  created_at: string;
  demands: boolean;
  demands_admin: boolean;
  demands_leader: boolean;
  id: number;
  issues: true;
  name: string;
  releases: boolean;
  super_admin: boolean;
  updated_at: string;
  users: IUser[];
};

export type IRoleCreate = Pick<IRole, "name">;

export type IRoleUpdate = Pick<IRole, "id" | "name">;
