import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  activeLabel: string;
  activeLink: string;
  activeBreadcrumbLabel: string;
  sipBOID: number | string;
  unitBOID: string | number;
};

type Action = {
  setActiveLabel: (activeLabel: State["activeLabel"]) => void;
  setActiveLink: (activeLink: State["activeLink"]) => void;
  setActiveBreadCrumbLabel: (
    activeBreadcrumbLabel: State["activeBreadcrumbLabel"]
  ) => void;
  setSipId: (sipId: State["sipBOID"]) => void;
  setUnitBOID: (unitBOID: State["unitBOID"]) => void;
};

export const useNavStore = create(
  persist<State & Action>(
    (set) => ({
      activeLabel: "Dashboard",
      activeLink: "",
      activeBreadcrumbLabel: "",
      sipBOID: "",
      unitBOID: "",
      setActiveLabel: (activeLabel: string) =>
        set(() => ({ activeLabel: activeLabel })),
      setActiveLink: (activeLink: string) =>
        set(() => ({ activeLink: activeLink })),
      setActiveBreadCrumbLabel: (activeBreadcrumbLabel: string) =>
        set(() => ({ activeBreadcrumbLabel: activeBreadcrumbLabel })),
      setSipId: (sipBOID: string) => set(() => ({ sipBOID })),
      setUnitBOID: (unitBOID: string) => set(() => ({ unitBOID })),
    }),
    {
      name: "navbar-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
