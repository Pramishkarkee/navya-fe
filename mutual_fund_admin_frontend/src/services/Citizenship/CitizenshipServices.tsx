import { skipToken, useQuery } from "@tanstack/react-query";
import axios from "axios";

const getCitizenship = async (path: string) => {
    const response = await axios.get(`${path}`)
    return response.data
}

export const useGetCitizenship = (path: string) => {
    return useQuery({
        queryKey: ['Citizenship'],
        queryFn: path ? () => getCitizenship(path) : skipToken
    })
}