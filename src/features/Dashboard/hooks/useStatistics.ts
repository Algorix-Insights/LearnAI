import { useQuery } from '@tanstack/react-query';
import { UsersService } from '@/services/Users';

export function useStatistics(period: 'week' | 'month' | 'all' = 'week') {
    return useQuery({
        queryKey: ['statistics', period],
        queryFn: () => UsersService.getStatistics({ period }),
    });
}