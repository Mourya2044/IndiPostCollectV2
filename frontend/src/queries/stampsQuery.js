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
        params['categories'] = filters.categories.join(','); // serialize array
    }
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
