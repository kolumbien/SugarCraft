import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './client';
import { Article, CreateArticleDTO, Ingredient, CreateIngredientDTO } from '../types';

export const useArticles = () => {
    return useQuery({
        queryKey: ['articles'],
        queryFn: async () => {
            const { data } = await api.get<Article[]>('/articles/');
            return data;
        },
    });
};

export const useArticle = (id: number) => {
    return useQuery({
        queryKey: ['articles', id],
        queryFn: async () => {
            const { data } = await api.get<Article>(`/articles/${id}`);
            return data;
        },
        enabled: !!id,
    });
};

export const useCreateArticle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newArticle: CreateArticleDTO) => {
            const { data } = await api.post<Article>('/articles/', newArticle);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
        },
    });
};

export const useCreateIngredient = (articleId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newIngredient: CreateIngredientDTO) => {
            const { data } = await api.post<Ingredient>(`/articles/${articleId}/ingredients/`, newIngredient);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles', articleId] });
        },
    });
};
