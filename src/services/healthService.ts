import axios from 'axios';

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  database: 'connected' | 'disconnected';
}

export const healthService = {
  async check(): Promise<HealthResponse> {
    const res = await axios.get<HealthResponse>('/health');
    return res.data;
  },
};
