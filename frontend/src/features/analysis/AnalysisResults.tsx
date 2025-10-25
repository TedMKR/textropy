import React, {type FC} from 'react';
import {useAnalysisStore} from '@/store/analysisStore';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell} from 'recharts';

export const AnalysisResults: FC = () => {
    const {currentResult, isLoading, error} = useAnalysisStore();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-4">
                    <div
                        className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"/>
                    <p className="text-gray-600 dark:text-gray-400">Анализируем текст...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 animate-slide-up">
                <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div>
                        <h3 className="font-semibold text-red-900 dark:text-red-200">Ошибка</h3>
                        <p className="text-red-700 dark:text-red-300">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentResult) {
        return null;
    }

    // Подготовка данных для графика
    const chartData = currentResult.letter_stats
        .filter(stat => stat.probability > 0)
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 15); // Топ-15 букв

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6 animate-slide-up">
            {/* Main Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Энтропия (H)"
                    value={currentResult.entropy.toFixed(4)}
                    subtitle="биты"
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                    }
                    color="from-blue-500 to-blue-600"
                />

                <StatCard
                    title="Всего слов (N)"
                    value={currentResult.total_words.toString()}
                    subtitle="слов"
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                    }
                    color="from-green-500 to-green-600"
                />

                <StatCard
                    title="Мат. ожидание (χ)"
                    value={currentResult.mean.toFixed(4)}
                    subtitle="среднее"
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
                        </svg>
                    }
                    color="from-purple-500 to-purple-600"
                />

                <StatCard
                    title="Станд. откл. (σ)"
                    value={currentResult.std_dev.toFixed(4)}
                    subtitle="дисперсия"
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                    }
                    color="from-orange-500 to-orange-600"
                />
            </div>

            {/* Chart */}
            <div
                className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Распределение вероятностей по буквам
                </h2>

                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2}/>
                        <XAxis
                            dataKey="letter"
                            stroke="#6B7280"
                            style={{fontSize: '14px', fontWeight: 'bold'}}
                        />
                        <YAxis
                            stroke="#6B7280"
                            style={{fontSize: '12px'}}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#F9FAFB',
                            }}
                            formatter={(value: number) => [value.toFixed(4), 'Вероятность']}
                        />
                        <Bar dataKey="probability" radius={[8, 8, 0, 0]}>
                            {chartData.map((_entry, _index) => (
                                <Cell key={`cell-${_index}`} fill={`hsl(${160 - _index * 10}, 70%, 50%)`}/>
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Letter Statistics Table */}
            <div
                className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Детальная статистика по буквам
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Буква
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Количество
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Вероятность (Pi)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Вклад в энтропию
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Прогресс
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {currentResult.letter_stats
                            .filter(stat => stat.count > 0)
                            .sort((a, b) => b.probability - a.probability)
                            .map((stat, _index) => (
                                <tr key={stat.letter}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-2xl font-bold text-primary-500">{stat.letter}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {stat.count}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
                                        {stat.probability.toFixed(6)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
                                        {stat.contribution.toFixed(6)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                                                style={{width: `${(stat.probability * 100).toFixed(2)}%`}}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

interface StatCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
}

const StatCard: FC<StatCardProps> = ({title, value, subtitle, icon, color}) => {
    return (
        <div
            className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${color} text-white`}>
                    {icon}
                </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
        </div>
    );
};
