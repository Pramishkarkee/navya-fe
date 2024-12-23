
const url = localStorage.getItem('url')

export const baseUrl = url ? url:import.meta.env.VITE_BASE_URL



