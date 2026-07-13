import { useQuery } from '@tanstack/react-query';
import { UsersService } from '@/services/Users';

export function useMe() {
    return useQuery({ queryKey: ['me'], queryFn: UsersService.getMe });
}