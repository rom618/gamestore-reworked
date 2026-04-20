import { api } from "./client";
import type { Review, CreateReviewRequest } from "../types";

const BASE = "/reviews";

export const reviewsApi = {
  create: (data: CreateReviewRequest) =>
    api.post<Review>(BASE, data),

  getById: (id: number) =>
    api.get<Review>(`${BASE}/${id}`),

  getByGame: (gameId: number) =>
    api.get<Review[]>(`${BASE}/game/${gameId}`),

  getByCustomer: (customerId: number) =>
    api.get<Review[]>(`${BASE}/customer/${customerId}`),

  updateLikesDislikes: (id: number, data: { likeCount?: number; dislikeCount?: number }) =>
    api.put<Review>(`${BASE}/${id}/update`, data),

  delete: (id: number) =>
    api.delete(`${BASE}/${id}`),
};