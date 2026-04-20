import { api } from "./client";
import type { Address, CreateAddressRequest } from "../types";

const BASE = "/addresses";

export const addressesApi = {
  create: (data: CreateAddressRequest) =>
    api.post<Address>(BASE, data),

  getAll: () =>
    api.get<Address[]>(BASE),

  getById: (id: number) =>
    api.get<Address>(`${BASE}/${id}`),

  getByCity: (city: string) =>
    api.get<Address[]>(`${BASE}/city/${encodeURIComponent(city)}`),

  update: (id: number, data: Partial<CreateAddressRequest>) =>
    api.put<Address>(`${BASE}/${id}`, data),

  delete: (id: number) =>
    api.delete(`${BASE}/${id}`),
};