export type Role = "superadmin" | "admin" | "vendor";

export type Vendor = {
  id: string;
  contact_name: string;
  contact_phone: string | null;
  pickup_address_text: string;
  pickup_lat: number | null;
  pickup_lon: number | null;
  pickup_window_start: string | null;
  pickup_window_end: string | null;
  is_active: boolean;
  stats: {
    total_orders: number;
    ready_count: number;
    geocode_pending: number;
    last_order_at: string | null;
    by_status: Record<string, number>;
  };
};

export type Admin = {
  id: string;
  user_id: string;
  contact_name: string;
  contact_phone: string | null;
  address: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  role: Role;
};

export type CurrentUser =
  | {
      user: User & { role: "superadmin" };
      admin: null;
      vendor: null;
    }
  | {
      user: User & { role: "admin" };
      admin: Admin;
      vendor: null;
    }
  | {
      user: User & { role: "vendor" };
      admin: null;
      vendor: Vendor;
    };

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  role: string;
  username: string;
  email: string;
};
