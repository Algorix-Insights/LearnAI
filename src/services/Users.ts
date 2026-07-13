import { api } from '@/services/api';

function unwrapResponse<T>(payload: { data?: T } | T) {
    return (payload as { data?: T }).data ?? payload;
}

const route = '/users';

type StatisticsParams = {
    period?: 'week' | 'month' | 'all';
    timezone?: string;
};

export const UsersService = {
    getMe: async () => {
        const response = await api.get(`${route}/me`);
        return unwrapResponse(response.data);
    },
    getStatistics: async (params: StatisticsParams = {}) => {
        const response = await api.get(`${route}/me/statistics`, {
            params: { period: params.period ?? 'week', timezone: params.timezone ?? 'America/Cancun' },
        });
        return unwrapResponse(response.data);
    },
};