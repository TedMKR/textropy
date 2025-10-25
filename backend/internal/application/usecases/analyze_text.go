package usecases

import (
	"context"
	"textropy/internal/application/services"
	"textropy/internal/domain/entities"
	"textropy/internal/domain/valueobjects"
)

// AnalyzeTextUseCase - use case для анализа текста
type AnalyzeTextUseCase struct {
	analyzer *services.TextAnalyzer
}

// NewAnalyzeTextUseCase создает новый use case
func NewAnalyzeTextUseCase(analyzer *services.TextAnalyzer) *AnalyzeTextUseCase {
	return &AnalyzeTextUseCase{
		analyzer: analyzer,
	}
}

// AnalyzeTextInput - входные данные для анализа
type AnalyzeTextInput struct {
	Content  string
	Language string
}

// AnalyzeTextOutput - результат анализа
type AnalyzeTextOutput struct {
	Analysis    *entities.Analysis
	SortedStats []*entities.LetterStat
}

// Execute выполняет энтропийный анализ текста
func (uc *AnalyzeTextUseCase) Execute(ctx context.Context, input AnalyzeTextInput) (*AnalyzeTextOutput, error) {
	// Создаем объект языка
	language, err := valueobjects.NewLanguage(input.Language)
	if err != nil {
		return nil, err
	}

	// Создаем объект текста
	text, err := entities.NewText(input.Content, language.Code)
	if err != nil {
		return nil, err
	}

	// Выполняем анализ
	analysis, err := uc.analyzer.Analyze(text, language)
	if err != nil {
		return nil, err
	}

	// Получаем отсортированную статистику
	sortedStats := uc.analyzer.GetSortedLetterStats(analysis)

	return &AnalyzeTextOutput{
		Analysis:    analysis,
		SortedStats: sortedStats,
	}, nil
}
