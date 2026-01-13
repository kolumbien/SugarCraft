import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './client';
import { Factory, CreateFactoryDTO, Supplier, CreateSupplierDTO } from '../types';

export const useFactories = () => {
    return useQuery({
        queryKey: ['factories'],
        queryFn: async () => {
            const { data } = await api.get<Factory[]>('/factories/');
            return data;
        },
    });
};

export const useFactory = (id: number) => {
    return useQuery({
        queryKey: ['factories', id],
        queryFn: async () => {
            const { data } = await api.get<Factory>(`/factories/${id}`);
            return data;
        },
        enabled: !!id,
    });
};

export const useCreateFactory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newFactory: CreateFactoryDTO) => {
            const { data } = await api.post<Factory>('/factories/', newFactory);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['factories'] });
        },
    });
};

export const useCreateSupplier = (factoryId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newSupplier: CreateSupplierDTO) => {
            const { data } = await api.post<Supplier>(`/factories/${factoryId}/suppliers/`, newSupplier);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['factories', factoryId] });
        },
    });
};
