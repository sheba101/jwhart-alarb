import { apiClient } from "@/lib/api-client";

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export const authService = {
  login: async (data: LoginDto): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      data
    );

    return response.data;
  },
};