import axios from 'axios';
import type {AnalysisResult} from '@/store/analysisStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('❌ API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export interface AnalyzeRequest {
    content: string;
    language: string;
    translator?: string;
}

export interface TranslateAndAnalyzeRequest {
    content: string;
    source_language: string;
    target_language: string;
    translator: string;
}

export interface LetterFreqChange {
    letter: string;
    original_count: number;
    back_translated_count: number;
    original_probability: number;
    back_translated_probability: number;
    probability_change: number;
}

export interface TranslationComparison {
    entropy_loss: number;
    entropy_loss_percent: number;
    mean_difference: number;
    std_dev_difference: number;
    letter_freq_changes: Record<string, LetterFreqChange>;
}

export interface TranslationResult {
    id: string;
    original_text: string;
    original_language: string;
    original_analysis: AnalysisResult;
    translated_text: string;
    target_language: string;
    translated_analysis: AnalysisResult;
    back_translated_text: string;
    back_translated_analysis: AnalysisResult;
    comparison: TranslationComparison;
    translator_used: string;
    created_at: string;
}

export interface ErrorResponse {
    error: string;
    message: string;
}

// Типы для языков
export interface Language {
    code: string;
    name: string;
}

export interface LanguagesResponse {
    languages: Language[];
    total: number;
}

export const analysisApi = {
    /**
     * Анализирует текст (без перевода)
     */
    async analyzeText(data: AnalyzeRequest): Promise<AnalysisResult> {
        const response = await apiClient.post<AnalysisResult>('/api/v1/analyze', data);
        return response.data;
    },

    /**
     * Полный цикл перевода и анализа
     */
    async translateAndAnalyze(data: TranslateAndAnalyzeRequest): Promise<TranslationResult> {
        const response = await apiClient.post<TranslationResult>('/api/v1/translate-analyze', data);
        return response.data;
    },

    /**
     * Health check
     */
    async healthCheck(): Promise<{ status: string; service: string }> {
        const response = await apiClient.get('/health');
        return response.data;
    },

    // Получить список поддерживаемых языков
    async getLanguages(): Promise<Language[]> {
        const response = await apiClient.get<LanguagesResponse>('/api/v1/languages');
        return response.data.languages;
    },
};

export default apiClient;
