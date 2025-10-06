export type Run = {
  id: string;
  name: string;
  is_team: boolean;
  drivers: { id: string; full_name: string }[];
  is_same_start_end: boolean;
  start_homebase: string;
  end_homebase: string | null;
};

export type RunListResponse = {
  status_code: number;
  message: string;
  data: Run[];
};
