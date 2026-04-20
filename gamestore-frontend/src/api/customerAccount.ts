import { api } from "./client";
import type {
  CustomerAccount,
  CreateCustomerAccountRequest,
} from "../types";

const BASE = "/api/customer-account";

export const customerAccountApi = {
  // ── Auth ──────────────────────────────────────
  login: (email: string, password: string) =>
    api.post<CustomerAccount>(`${BASE}/login`, { email, password }),

  // ── Queries ───────────────────────────────────
  getById: (id: number) =>
    api.get<CustomerAccount>(`${BASE}/get-with-id/${id}`),

  getByEmail: (email: string) =>
    api.get<CustomerAccount>(`${BASE}/get-with-email/${encodeURIComponent(email)}`),

  getByUsername: (username: string) =>
    api.get<CustomerAccount>(`${BASE}/get-with-username/${encodeURIComponent(username)}`),

  getAll: () =>
    api.get<CustomerAccount[]>(`${BASE}/get/all`),

  create: (data: CreateCustomerAccountRequest) =>
    api.post<CustomerAccount>(`${BASE}/create`, data),

  updateUsername: (email: string, username: string) =>
    api.put<CustomerAccount>(
      `${BASE}/update-username/${encodeURIComponent(email)}/${encodeURIComponent(username)}`
    ),

  updatePassword: (email: string, oldPassword: string, newPassword: string) =>
    api.put<CustomerAccount>(
      `${BASE}/update-password/${encodeURIComponent(email)}/${encodeURIComponent(oldPassword)}/${encodeURIComponent(newPassword)}`
    ),

  updateName: (email: string, name: string) =>
    api.put<CustomerAccount>(
      `${BASE}/update-name/${encodeURIComponent(email)}/${encodeURIComponent(name)}`
    ),

  delete: (id: number) =>
    api.delete(`${BASE}/delete/${id}`),

  test: () =>
    api.get<string>(`${BASE}/testing`),
};