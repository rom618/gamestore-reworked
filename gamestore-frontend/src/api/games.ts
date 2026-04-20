import { api } from "./client";
import type { Game, CreateGameRequest } from "../types";

const BASE = "/api/games";

export const gamesApi = {
  create: (data: CreateGameRequest) =>
    api.post<Game>(`${BASE}/new-game`, data),

  getById: (id: number) =>
    api.get<Game>(`${BASE}/get/${id}`),

  getAll: () =>
    api.get<Game[]>(`${BASE}/get/allgames`),

  update: (id: number, data: Partial<CreateGameRequest>) =>
    api.put<Game>(`${BASE}/update/${id}`, data),

  delete: (id: number) =>
    api.delete(`${BASE}/delete/${id}`),
};