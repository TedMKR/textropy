import {ThemeProvider} from '@/theme/ThemeProvider';
import {ThemeSwitch} from '@/shared/ui/ThemeSwitch';
import {TextUploader} from '@/features/upload/TextUploader';
import {AnalysisResults} from '@/features/analysis/AnalysisResults';
import {TranslationComparisonResults} from '@/features/analysis/TranslationComparisonResults';
import {useAnalysisStore} from '@/store/analysisStore';

function App() {
    const {currentResult, currentTranslationResult} = useAnalysisStore();

    return (
        <ThemeProvider>
            <div className="min-h-screen bg-background dark:bg-background-dark transition-colors duration-300">
                {/* Header */}
                <header
                    className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 bg-gradient-to-br from-primary to-primary-700 rounded-xl flex items-center justify-center shadow-glow">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Textropy</h1>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Система Энтропийного
                                        Анализа</p>
                                </div>
                            </div>

                            <ThemeSwitch/>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-8 space-y-8">
                    {/* Hero Section */}
                    <div className="text-center space-y-4 animate-fade-in">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                            Энтропийный Анализ Текста
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            Двойной перевод текста через Yandex Translate для измерения информационных потерь по
                            алгоритму Шеннона
                        </p>
                    </div>

                    <TextUploader/>

                    {/* Показываем результаты */}
                    {currentTranslationResult && <TranslationComparisonResults result={currentTranslationResult}/>}
                    {currentResult && !currentTranslationResult && <AnalysisResults/>}
                </main>

                {/* Footer */}
                <footer className="mt-16 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
                    <div className="container mx-auto px-4 py-8">
                        <div className="text-center space-y-3">
                            <div className="flex items-center justify-center gap-2 text-primary">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span className="text-sm font-semibold">
                  Энтропийный анализ с двойным переводом
                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Формула Шеннона: <span className="font-mono font-semibold text-primary">H = -Σ(Pᵢ × log₂(Pᵢ))</span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                Textropy © 2025 • Yandex Translate API • Go + React + TypeScript
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </ThemeProvider>
    );
}

export default App;
