import React, {useState, useEffect} from 'react';
import {useAnalysisStore} from '@/store/analysisStore';
import {analysisApi, type Language} from '@/shared/api/client';

export const TextUploader: React.FC = () => {
    const {
        textContent,
        selectedLanguage,
        selectedTargetLanguage,
        isLoading,
        error,
        setTextContent,
        setLanguage,
        setTargetLanguage,
        setTranslationResult,
        setLoading,
        setError,
    } = useAnalysisStore();

    const [charCount, setCharCount] = useState(0);
    const [wordCount, setWordCount] = useState(0);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [loadingLanguages, setLoadingLanguages] = useState(true);

    // Загружаем список языков при монтировании
    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                setLoadingLanguages(true);
                const langs = await analysisApi.getLanguages();
                setLanguages(langs);
            } catch (err) {
                console.error('Ошибка загрузки языков:', err);
                setError('Не удалось загрузить список языков');
            } finally {
                setLoadingLanguages(false);
            }
        };
        fetchLanguages();
    }, [setError]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setTextContent(text);

        // Обновляем счетчики
        setCharCount(text.length);
        setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            setTextContent(text);
            setCharCount(text.length);
            setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
        };
        reader.readAsText(file);
    };

    const handleTranslateAndAnalyze = async () => {
        if (!textContent.trim()) {
            setError('Пожалуйста, введите текст для анализа');
            return;
        }

        if (!selectedTargetLanguage) {
            setError('Пожалуйста, выберите промежуточный язык');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const result = await analysisApi.translateAndAnalyze({
                content: textContent,
                source_language: selectedLanguage,
                target_language: selectedTargetLanguage,
                translator: 'yandex',
            });

            setTranslationResult(result);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка при переводе и анализе');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
            Textropy
          </span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Энтропийный анализ текста с переводом через Yandex Translate
                </p>
            </div>

            {/* Main Card */}
            <div
                className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Settings Bar */}
                <div
                    className="p-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Настройки Перевода
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Выберите исходный и промежуточный язык для двойного перевода
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Исходный язык */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Исходный язык текста
                            </label>
                            <select
                                value={selectedLanguage}
                                onChange={(e) => setLanguage(e.target.value)}
                                disabled={loadingLanguages}
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
                            >
                                {loadingLanguages ? (
                                    <option>Загрузка языков...</option>
                                ) : (
                                    languages.map((lang) => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        {/* Промежуточный язык */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Промежуточный язык перевода
                            </label>
                            <select
                                value={selectedTargetLanguage}
                                onChange={(e) => setTargetLanguage(e.target.value)}
                                disabled={loadingLanguages}
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
                            >
                                {loadingLanguages ? (
                                    <option>Загрузка языков...</option>
                                ) : (
                                    languages.map((lang) => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>

                    {/* Описание алгоритма */}
                    <div
                        className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-lg p-4 border border-primary/20">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                <p className="font-medium mb-1">Алгоритм двойного перевода (Yandex Translate):</p>
                                <ol className="list-decimal list-inside space-y-1 text-xs">
                                    <li>Анализ оригинального текста на исходном языке</li>
                                    <li>Перевод текста на промежуточный язык</li>
                                    <li>Обратный перевод на исходный язык</li>
                                    <li>Анализ обратного перевода и сравнение энтропий</li>
                                    <li>Измерение потери информации</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Text Area */}
                <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Текст для анализа
                        </label>
                        <label
                            className="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-lg
                              cursor-pointer transition-colors duration-200 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                            Загрузить файл
                            <input
                                type="file"
                                accept=".txt,.doc,.docx"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <textarea
                        value={textContent}
                        onChange={handleTextChange}
                        placeholder="Введите или вставьте текст для анализа...&#10;&#10;Например:&#10;Я люблю, когда шумят берёзы,&#10;Когда листья падают с берёз.&#10;Слушаю – и набегают слёзы&#10;На глаза, отвыкшие от слёз.&#10;&#10;Всё очнётся в памяти невольно,&#10;Отзовётся в сердце и в крови.&#10;Станет как-то радостно и больно,&#10;Будто кто-то шепчет о любви."
                        className="w-full h-80 px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                     transition-all duration-200 resize-none font-mono text-sm"
                    />

                    {/* Stats */}
                    <div className="flex justify-between items-center mt-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex gap-4">
                            <span>Символов: <strong className="text-primary">{charCount}</strong></span>
                            <span>Слов: <strong className="text-primary">{wordCount}</strong></span>
                        </div>
                    </div>
                </div>

                {/* Analyze Button */}
                <div className="p-6 pt-0 space-y-4">
                    {/* Error Display */}
                    {error && (
                        <div
                            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <div>
                                    <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">Ошибка</h4>
                                    <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div
                            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <svg className="animate-spin w-5 h-5 text-blue-600 dark:text-blue-400" fill="none"
                                     viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <div>
                                    <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">Обработка...</h4>
                                    <p className="text-sm text-blue-700 dark:text-blue-400">Выполняется двойной перевод
                                        и анализ текста</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleTranslateAndAnalyze}
                        disabled={!textContent.trim() || !selectedTargetLanguage || isLoading}
                        className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600
                     hover:from-primary-600 hover:to-primary-700
                     text-white font-semibold rounded-xl text-lg
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transform hover:scale-[1.02] active:scale-[0.98]
                     transition-all duration-200 shadow-lg hover:shadow-xl
                     flex items-center justify-center gap-3"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Обработка...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                                    />
                                </svg>
                                <span>Запустить Полный Цикл Перевода и Анализа</span>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
