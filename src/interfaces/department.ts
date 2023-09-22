export type IDepartment = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type IDepartmentCreate = Pick<IDepartment, "name">;

export type IDepartmentUpdate = Pick<IDepartment, "id" | "name">;
