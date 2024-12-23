import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type State = {
    activeLabel: string,
    activeLink: string,
    activeBreadcrumbLabel: string
}

type Action = {
    setActiveLabel: (activeLabel: State['activeLabel']) => void,
    setActiveLink: (activeLink: State['activeLink']) => void,
    setActiveBreadCrumbLabel: (activeBreadcrumbLabel: State['activeBreadcrumbLabel']) => void
}  

export const useNavStore = create  (

    persist<State & Action>(
        (set) => ({
            activeLabel: 'Dashboard',
            activeLink: '',
            activeBreadcrumbLabel: '',
            setActiveLabel: (activeLabel: string) => set(() => ({ activeLabel: activeLabel })),
            setActiveLink: (activeLink: string) => set(() => ({ activeLink: activeLink })),
            setActiveBreadCrumbLabel: (activeBreadcrumbLabel: string) => set(() => ({activeBreadcrumbLabel: activeBreadcrumbLabel}))
   
        }),
        {
            name: 'navbar-storage',
            storage: createJSONStorage(() => sessionStorage)
        }

    )

)