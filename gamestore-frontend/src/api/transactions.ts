import { api } from "./client";
import type { Transaction, CreateTransactionRequest } from "../types";

const BASE = "/api/transaction";

export const transactionApi = {
  getById: (id: number) =>
    api.get<Transaction>(`${BASE}/get/${id}`),

  getByCustomer: (customerId: number) =>
    api.get<Transaction[]>(`${BASE}/get-by-customer/${customerId}`),

  create: (data: CreateTransactionRequest) =>
    api.post<Transaction>(`${BASE}/create`, data),

  update: (id: number, data: Partial<CreateTransactionRequest>) =>
    api.put<Transaction>(`${BASE}/update/${id}`, data),

  delete: (id: number) =>
    api.delete(`${BASE}/delete/${id}`),
};