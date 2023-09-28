export interface ILog {
  id: string;
  action: string;
  resource: string;
  data: unknown;
  previousData: unknown;
  timestamp: string;
}
