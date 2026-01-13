import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './client';
import { Shop, CreateShopDTO } from '../types';

export const useShops = () => {
    return useQuery({
        queryKey: ['shops'],
        queryFn: async () => {
            const { data } = await api.get<Shop[]>('/shops/');
            return data;
        },
    });
};

export const useShop = (id: number) => {
    return useQuery({
        queryKey: ['shops', id],
        queryFn: async () => {
            const { data } = await api.get<Shop>(`/shops/${id}`);
            return data;
        },
        enabled: !!id,
    });
};

export const useCreateShop = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newShop: CreateShopDTO) => {
            const { data } = await api.post<Shop>('/shops/', newShop);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shops'] });
        },
    });
};

export const useDeleteShop = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete<Shop>(`/shops/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shops'] });
        },
    });
};
