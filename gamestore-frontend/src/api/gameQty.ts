import { api } from "./client";
import type { GameQty, CreateGameQtyRequest, UpdateGameQtyRequest } from "../types";

const BASE = "/api/game_qty";

export const gameQtyApi = {
  getById: (id: number) =>
    api.get<GameQty>(`${BASE}/get/${id}`),

  getByTransaction: (transactionId: number) =>
    api.get<GameQty[]>(`${BASE}/get_by_transaction/${transactionId}`),

  create: (data: CreateGameQtyRequest) =>
    api.post<GameQty>(`${BASE}/create`, data),

  update: (data: UpdateGameQtyRequest) =>
    api.put<GameQty>(`${BASE}/update`, data),

  delete: (id: number) =>
    api.delete(`${BASE}/delete/${id}`),
};