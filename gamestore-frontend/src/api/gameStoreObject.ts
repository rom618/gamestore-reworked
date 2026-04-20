import { api } from "./client";
import type { GameStoreApplication } from "../types";

const BASE = "/api/game-store-object";

export const gameStoreObjectApi = {
  create: (data: Partial<GameStoreApplication>) =>
    api.post<GameStoreApplication>(`${BASE}/create`, data),

  getById: (id: number) =>
    api.get<GameStoreApplication>(`${BASE}/${id}`),

  update: (id: number, data: Partial<GameStoreApplication>) =>
    api.put<GameStoreApplication>(`${BASE}/update/${id}`, data),

  delete: (id: number) =>
    api.delete(`${BASE}/delete/${id}`),
};