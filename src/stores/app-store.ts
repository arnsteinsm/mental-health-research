import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types
interface VisualizationState {
  selectedCountries: string[];
  selectedMetric: string;
  selectedYear: string;
  viewMode: 'correlation' | 'trends' | 'comparison';
  isLoading: boolean;
}

interface NavigationState {
  isMobileMenuOpen: boolean;
  isScrolled: boolean;
  activeSection: string;
}

interface UIState {
  modals: {
    evidence: boolean;
    share: boolean;
  };
}

interface AppState extends VisualizationState, NavigationState, UIState {
  // Visualization actions
  setSelectedCountries: (countries: string[]) => void;
  setSelectedMetric: (metric: string) => void;
  setSelectedYear: (year: string) => void;
  setViewMode: (mode: 'correlation' | 'trends' | 'comparison') => void;
  setIsLoading: (loading: boolean) => void;

  // Navigation actions
  setMobileMenuOpen: (open: boolean) => void;
  setScrolled: (scrolled: boolean) => void;
  setActiveSection: (section: string) => void;

  // UI actions
  openModal: (modal: keyof UIState['modals']) => void;
  closeModal: (modal: keyof UIState['modals']) => void;
  closeAllModals: () => void;

  // Reset actions
  resetVisualization: () => void;
  resetAll: () => void;
}

// Initial state
const initialState = {
  // Visualization
  selectedCountries: ['Germany', 'France', 'Italy'],
  selectedMetric: 'alcohol_consumption',
  selectedYear: '2022',
  viewMode: 'correlation' as const,
  isLoading: false,

  // Navigation
  isMobileMenuOpen: false,
  isScrolled: false,
  activeSection: 'hero',

  // UI
  modals: {
    evidence: false,
    share: false,
  },
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, _get) => ({
        ...initialState,

        // Visualization actions
        setSelectedCountries: (countries) =>
          set({ selectedCountries: countries }, false, 'setSelectedCountries'),

        setSelectedMetric: (metric) => set({ selectedMetric: metric }, false, 'setSelectedMetric'),

        setSelectedYear: (year) => set({ selectedYear: year }, false, 'setSelectedYear'),

        setViewMode: (mode) => set({ viewMode: mode }, false, 'setViewMode'),

        setIsLoading: (loading) => set({ isLoading: loading }, false, 'setIsLoading'),

        // Navigation actions
        setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }, false, 'setMobileMenuOpen'),

        setScrolled: (scrolled) => set({ isScrolled: scrolled }, false, 'setScrolled'),

        setActiveSection: (section) => set({ activeSection: section }, false, 'setActiveSection'),

        // UI actions
        openModal: (modal) =>
          set(
            (state) => ({
              modals: { ...state.modals, [modal]: true },
            }),
            false,
            `openModal:${modal}`
          ),

        closeModal: (modal) =>
          set(
            (state) => ({
              modals: { ...state.modals, [modal]: false },
            }),
            false,
            `closeModal:${modal}`
          ),

        closeAllModals: () =>
          set({ modals: { evidence: false, share: false } }, false, 'closeAllModals'),

        // Reset actions
        resetVisualization: () =>
          set(
            {
              selectedCountries: initialState.selectedCountries,
              selectedMetric: initialState.selectedMetric,
              selectedYear: initialState.selectedYear,
              viewMode: initialState.viewMode,
              isLoading: false,
            },
            false,
            'resetVisualization'
          ),

        resetAll: () => set(initialState, false, 'resetAll'),
      }),
      {
        name: 'mental-health-research-store',
        partialize: (state) => ({
          selectedCountries: state.selectedCountries,
          selectedMetric: state.selectedMetric,
          selectedYear: state.selectedYear,
          viewMode: state.viewMode,
        }),
      }
    ),
    {
      name: 'MentalHealthResearchStore',
    }
  )
);
