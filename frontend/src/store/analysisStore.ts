import {create} from 'zustand';
import type {TranslationResult} from '@/shared/api/client';

export interface LetterStat {
    letter: string;
    count: number;
    probability: number;
    contribution: number;
}

export interface AnalysisResult {
    id: string;
    entropy: number;
    total_words: number;
    mean: number;
    std_dev: number;
    letter_stats: LetterStat[];
    created_at: string;
}

interface AnalysisState {
    // State
    currentResult: AnalysisResult | null;
    currentTranslationResult: TranslationResult | null;
    isLoading: boolean;
    error: string | null;

    // Text input
    textContent: string;
    selectedLanguage: string;
    selectedTranslator: string;
    selectedTargetLanguage: string;

    // Actions
    setTextContent: (content: string) => void;
    setLanguage: (language: string) => void;
    setTranslator: (translator: string) => void;
    setTargetLanguage: (language: string) => void;
    setResult: (result: AnalysisResult) => void;
    setTranslationResult: (result: TranslationResult) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
    // Initial state
    currentResult: null,
    currentTranslationResult: null,
    isLoading: false,
    error: null,
    textContent: '',
    selectedLanguage: 'ru',
    selectedTranslator: 'yandex',
    selectedTargetLanguage: '',

    // Actions
    setTextContent: (content) => set({textContent: content}),
    setLanguage: (language) => set({selectedLanguage: language}),
    setTranslator: (translator) => set({selectedTranslator: translator}),
    setTargetLanguage: (language) => set({selectedTargetLanguage: language}),
    setResult: (result) => set({currentResult: result, currentTranslationResult: null, error: null}),
    setTranslationResult: (result) => set({currentTranslationResult: result, currentResult: null, error: null}),
    setLoading: (loading) => set({isLoading: loading}),
    setError: (error) => set({error, isLoading: false}),
    reset: () => set({
        currentResult: null,
        currentTranslationResult: null,
        isLoading: false,
        error: null,
        textContent: '',
    }),
}));
