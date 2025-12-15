import api from '@/lib/api';
import { LoginResponse, LoginFormValues, RegisterFormValues, RegisterResponse } from '@/types/auth';

const AuthService = {
  // POST /api/users/login
  login: async (credentials: LoginFormValues): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/users/login', credentials);
    return response.data;
  },

  // POST /api/users/register
  register: async (data: RegisterFormValues): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/users/register', data);
    return response.data;
  },
};

export default AuthService;