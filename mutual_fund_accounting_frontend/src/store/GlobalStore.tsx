// import {create} from 'zustand'
// import dayjs, { Dayjs } from 'dayjs';


// type State = {
//     //baseUrl: string
//     // access_token: string
//     allotmentDate: Dayjs | null; // Store allotmentDate as a Dayjs object
//     setAllotmentDate: (date: Dayjs | null) => void; // Updater function

// }

// export const useGlobalStore = create<State> ((set) => ({
//     // baseUrl: 'https://api-mf-acc.navyaadvisors.com'
//     //    access_token: localStorage.getItem('access_token'),
//     allotmentDate: null, // Initial state
//     setAllotmentDate: (date) => set({ allotmentDate: date }), // Updater function
   

// }))



import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
    // allotmentDate: string | null;
    allotmentDate: Date | null;
    
    };

type Action = {
    setAllotmentDate: (date: Date | null) => void;
    // setAllotmentDate: (allotmentDate: string) => void;
};

export const useGlobalStore = create(
  persist<State & Action>(
    (set) => ({
      allotmentDate: null,
      setAllotmentDate: (date) => set(() =>({ allotmentDate: date })),
    //   setAllotmentDate: (allotmentDate:string) => set(() => ({allotmentDate})),
    //   setSipId:(sipBOID:string)=>set(()=>({sipBOID})),

    }),
    { name: 'global-store' } // Key for localStorage
  )
);
