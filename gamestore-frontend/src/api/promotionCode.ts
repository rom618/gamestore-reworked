import { api } from "./client";
import type { PromotionCode, CreatePromotionCodeRequest } from "../types";

const BASE = "/promotion-code";

export const promotionCodeApi = {
  create: (data: CreatePromotionCodeRequest) =>
    api.post<PromotionCode>(`${BASE}/create`, data),

  getById: (id: number) =>
    api.get<PromotionCode>(`${BASE}/${id}`),

  delete: (id: number) =>
    api.delete(`${BASE}/delete/${id}`),
};