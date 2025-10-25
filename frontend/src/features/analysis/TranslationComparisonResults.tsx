import {useMemo} from 'react';
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import type {TranslationResult} from '@/shared/api/client';

interface Props {
    result: TranslationResult;
}

export const TranslationComparisonResults = ({result}: Props) => {
    // Подготавливаем данные для графика сравнения энтропий
    const entropyChartData = useMemo(() => [
        {
            name: 'Оригинал',
            entropy: result.original_analysis.entropy,
            fill: '#00A779',
        },
        {
            name: 'Перевод',
            entropy: result.translated_analysis.entropy,
            fill: '#3B82F6',
        },
        {
            name: 'Обратно',
            entropy: result.back_translated_analysis.entropy,
            fill: '#EF4444',
        },
    ], [result]);

    // Топ-10 букв с наибольшими изменениями
    const topChanges = useMemo(() => {
        if (!result.comparison) return [];

        return Object.values(result.comparison.letter_freq_changes)
            .sort((a, b) => Math.abs(b.probability_change) - Math.abs(a.probability_change))
            .slice(0, 10);
    }, [result.comparison]);

    const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;
    const formatEntropyLoss = (value: number) => {
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(4)}`;
    };

    return (
        <div className="space-y-6">
            {/* Заголовок */}
            <div className="bg-gradient-to-r from-primary to-primary-700 rounded-xl p-6 text-white shadow-glow">
                <div className="flex items-center gap-3 mb-2">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                    </svg>
                    <h2 className="text-2xl font-bold">
                        Результаты Сравнительного Анализа
                    </h2>
                </div>
                <p className="text-white/90 text-sm">
                    Переводчик: <span className="font-semibold">{result.translator_used.toUpperCase()}</span> •
                    Промежуточный язык: <span className="font-semibold">{result.target_language.toUpperCase()}</span>
                </p>
            </div>

            {/* Метрики потерь */}
            {result.comparison && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Потеря энтропии */}
                    <div
                        className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Потеря Энтропии</div>
                        <div
                            className={`text-3xl font-bold ${result.comparison.entropy_loss >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatEntropyLoss(result.comparison.entropy_loss)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            ({result.comparison.entropy_loss_percent.toFixed(2)}%)
                        </div>
                    </div>

                    {/* Изменение χ */}
                    <div
                        className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Δχ (Mean)</div>
                        <div className="text-3xl font-bold text-blue-600">
                            {formatEntropyLoss(result.comparison.mean_difference)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Математическое ожидание
                        </div>
                    </div>

                    {/* Изменение σ */}
                    <div
                        className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Δσ (StdDev)</div>
                        <div className="text-3xl font-bold text-purple-600">
                            {formatEntropyLoss(result.comparison.std_dev_difference)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Стандартное отклонение
                        </div>
                    </div>

                    {/* Количество слов */}
                    <div
                        className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Слов в анализе</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                            {result.original_analysis.total_words}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Общее количество
                        </div>
                    </div>
                </div>
            )}

            {/* График сравнения энтропий */}
            <div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Сравнение Энтропий
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={entropyChartData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1}/>
                        <XAxis dataKey="name" stroke="#9CA3AF"/>
                        <YAxis label={{value: 'Энтропия (бит)', angle: -90, position: 'insideLeft'}} stroke="#9CA3AF"/>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: '1px solid #E5E7EB',
                                borderRadius: '0.5rem',
                            }}
                            formatter={(value: number) => [value.toFixed(4), 'Энтропия']}
                        />
                        <Bar dataKey="entropy" radius={[8, 8, 0, 0]}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Топ изменений в распределении букв */}
            {topChanges.length > 0 && (
                <div
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Топ-10 Изменений в Распределении Букв
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Буква
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Оригинал
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    После
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Изменение
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {topChanges.map((change, index) => (
                                <tr key={change.letter}
                                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="py-3 px-4">
                                                <span
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold">
                                                    {change.letter}
                                                </span>
                                    </td>
                                    <td className="text-right py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                                        {formatPercent(change.original_probability)}
                                    </td>
                                    <td className="text-right py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                                        {formatPercent(change.back_translated_probability)}
                                    </td>
                                    <td className="text-right py-3 px-4 text-sm font-semibold">
                                                <span
                                                    className={change.probability_change > 0 ? 'text-red-600' : 'text-green-600'}>
                                                    {formatEntropyLoss(change.probability_change)}
                                                </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Тексты для сравнения */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Оригинальный текст */}
                <div
                    className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Оригинал
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {result.original_text.slice(0, 300)}
                        {result.original_text.length > 300 && '...'}
                    </p>
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        H = {result.original_analysis.entropy.toFixed(4)} бит
                    </div>
                </div>

                {/* Переведенный текст */}
                <div
                    className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Перевод ({result.target_language.toUpperCase()})
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {result.translated_text.slice(0, 300)}
                        {result.translated_text.length > 300 && '...'}
                    </p>
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        H = {result.translated_analysis.entropy.toFixed(4)} бит
                    </div>
                </div>

                {/* Обратный перевод */}
                <div
                    className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        Обратный перевод
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {result.back_translated_text.slice(0, 300)}
                        {result.back_translated_text.length > 300 && '...'}
                    </p>
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        H = {result.back_translated_analysis.entropy.toFixed(4)} бит
                    </div>
                </div>
            </div>
        </div>
    );
};
