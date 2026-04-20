import { api } from "./client";
import type { StaffAccount, CreateStaffAccountRequest } from "../types";

const BASE = "/api/staff-account";

export const staffAccountApi = {
  getById: (id: number) =>
    api.get<StaffAccount>(`${BASE}/get-with-id/${id}`),

  getByUsername: (username: string) =>
    api.get<StaffAccount>(`${BASE}/get-with-username/${encodeURIComponent(username)}`),

  getAll: () =>
    api.get<StaffAccount[]>(`${BASE}/get/all`),

  create: (data: CreateStaffAccountRequest) =>
    api.post<StaffAccount>(`${BASE}/create`, data),

  updatePassword: (username: string, oldPassword: string, newPassword: string) =>
    api.put<StaffAccount>(
      `${BASE}/update-password/${encodeURIComponent(username)}/${encodeURIComponent(oldPassword)}/${encodeURIComponent(newPassword)}`
    ),

  delete: (id: number) =>
    api.delete(`${BASE}/delete/${id}`),
};