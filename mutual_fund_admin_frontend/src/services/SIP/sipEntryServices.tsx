import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from 'config/axiosInstance';

const postSipRegistration = async (data) => {
    const response = await axiosInstance.post('/sip-up/api/v1/sip/sip-register/',
        data,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    )
    return response.data
}

export const useSipRegEntryMutation = () => {
    return useMutation({
        mutationFn: postSipRegistration,
        onSuccess: (data) => {
            // console.log('data on success', data)
        },
        onError: (error) => {
            // console.error(error)
        }
    })
}