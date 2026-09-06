import {
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios.js';


export const useStamps = (filters) => {
    return useQuery({
        queryKey: ['stamps', filters],
        queryFn: () => fetchStamps(filters)
    });
};

export const useStampFilterMeta = () => {
    return useQuery({
        queryKey: ['stampFilterMeta'],
        queryFn: async () => {
            const res = await axiosInstance.get('/stamps/meta/filters');
            return res.data;
        },
        staleTime: 1000 * 60 * 10
    });
};

export const useAddStamp = () => {
    const queryClient = useQueryClient();
    return useMutation(addStamp, {
        onSuccess: () => {
            queryClient.invalidateQueries(['stamps']);
        },
    });
};




// functions
const fetchStamps = async (filters = {}) => {
    const params = {};

    if (filters.search) params['search'] = filters.search;
    if (filters.regexsearch) params['regexsearch'] = filters.regexsearch;
    if (filters.categories && filters.categories.length > 0) {
        params['categories'] = filters.categories.join(',');
    }
    if (filters.condition && filters.condition.length > 0) {
        params['condition'] = filters.condition.join(',');
    }
    if (filters.minPrice !== undefined && filters.minPrice !== '') params['minPrice'] = filters.minPrice;
    if (filters.maxPrice !== undefined && filters.maxPrice !== '') params['maxPrice'] = filters.maxPrice;
    if (filters.minYear !== undefined && filters.minYear !== '') params['minYear'] = filters.minYear;
    if (filters.maxYear !== undefined && filters.maxYear !== '') params['maxYear'] = filters.maxYear;
    if (filters.historicalPeriod) params['historicalPeriod'] = filters.historicalPeriod;
    if (filters.forSale !== undefined) params['forSale'] = filters.forSale;
    if (filters.isMuseumPiece !== undefined) params['isMuseumPiece'] = filters.isMuseumPiece;
    if (filters.page) params['page'] = filters.page;
    if (filters.limit) params['limit'] = filters.limit;
    if (filters.sort) params['sort'] = filters.sort;
    if (filters.sortBy) params['sortBy'] = filters.sortBy;

    const response = await axiosInstance.get('/stamps', { params });
    return response.data;
};

const addStamp = async (stampData) => {
    const response = await axiosInstance.post('/stamps', stampData);
    return response.data;
};
