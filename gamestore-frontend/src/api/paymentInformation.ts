import { api } from "./client";
import type { PaymentInformation, CreatePaymentInformationRequest } from "../types";

const BASE = "/api/payment-information";

export const paymentInformationApi = {
  getById: (id: number) =>
    api.get<PaymentInformation>(`${BASE}/get/${id}`),

  getByCustomerAccount: (customerAccountId: number) =>
    api.get<PaymentInformation[]>(
      `${BASE}/get-by-customer-account/${customerAccountId}`
    ),

  create: (data: CreatePaymentInformationRequest) =>
    api.post<PaymentInformation>(`${BASE}/create`, data),

  update: (id: number, data: Partial<CreatePaymentInformationRequest>) =>
    api.put<PaymentInformation>(`${BASE}/update/${id}`, data),

  delete: (id: number) =>
    api.delete(`${BASE}/delete/${id}`),
};