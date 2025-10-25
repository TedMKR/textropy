package usecases

import (
	"context"
	"fmt"
	"textropy/internal/application/services"
	"textropy/internal/domain/entities"
	"textropy/internal/domain/valueobjects"
	"textropy/internal/infrastructure/translators"
)

// TranslateAndAnalyzeUseCase - Use Case для полного цикла перевода и анализа
// Реализует алгоритм из Практической работы №36:
// 1. Анализ оригинального текста
// 2. Перевод на целевой язык (например, суахили)
// 3. Анализ переведенного текста
// 4. Обратный перевод на исходный язык
// 5. Анализ обратно переведенного текста
// 6. Сравнение энтропий (измерение информационных потерь)
type TranslateAndAnalyzeUseCase struct {
	analyzer          *services.TextAnalyzer
	translatorFactory *translators.TranslatorFactory
}

// NewTranslateAndAnalyzeUseCase создает новый Use Case
func NewTranslateAndAnalyzeUseCase(
	analyzer *services.TextAnalyzer,
	translatorFactory *translators.TranslatorFactory,
) *TranslateAndAnalyzeUseCase {
	return &TranslateAndAnalyzeUseCase{
		analyzer:          analyzer,
		translatorFactory: translatorFactory,
	}
}

// TranslateAndAnalyzeInput - входные данные
type TranslateAndAnalyzeInput struct {
	OriginalText   string                      // Исходный текст
	SourceLanguage string                      // Язык оригинала (ru, en)
	TargetLanguage string                      // Промежуточный язык (sw, en)
	TranslatorType valueobjects.TranslatorType // yandex, google, deepl
}

// TranslateAndAnalyzeOutput - результат выполнения
type TranslateAndAnalyzeOutput struct {
	TranslationResult *entities.TranslationResult
	Comparison        *entities.TranslationComparison
}

// Execute выполняет полный цикл перевода и анализа
func (uc *TranslateAndAnalyzeUseCase) Execute(
	ctx context.Context,
	input TranslateAndAnalyzeInput,
) (*TranslateAndAnalyzeOutput, error) {

	// Валидация входных данных
	sourceLang, err := valueobjects.NewLanguage(input.SourceLanguage)
	if err != nil {
		return nil, fmt.Errorf("invalid source language: %w", err)
	}

	targetLang, err := valueobjects.NewLanguage(input.TargetLanguage)
	if err != nil {
		return nil, fmt.Errorf("invalid target language: %w", err)
	}

	// Создаем переводчик
	translator, err := uc.translatorFactory.Create(input.TranslatorType)
	if err != nil {
		return nil, fmt.Errorf("failed to create translator: %w", err)
	}

	if !translator.IsAvailable() {
		return nil, fmt.Errorf("translator %s is not available (API key missing)", translator.Name())
	}

	// Инициализируем результат
	result := entities.NewTranslationResult(
		input.OriginalText,
		sourceLang.Code,
		string(input.TranslatorType),
	)

	// ============================================================
	// ШАГ 1: Анализ оригинального текста
	// ============================================================
	originalText, err := entities.NewText(input.OriginalText, sourceLang.Code)
	if err != nil {
		return nil, fmt.Errorf("failed to create original text entity: %w", err)
	}

	result.OriginalAnalysis, err = uc.analyzer.Analyze(originalText, sourceLang)
	if err != nil {
		return nil, fmt.Errorf("failed to analyze original text: %w", err)
	}

	// ============================================================
	// ШАГ 2: Перевод на целевой язык (например, ru → sw)
	// ============================================================
	translatedText, err := translator.Translate(ctx, input.OriginalText, targetLang)
	if err != nil {
		return nil, fmt.Errorf("failed to translate to target language: %w", err)
	}

	result.TranslatedText = translatedText
	result.TargetLanguage = targetLang.Code

	// ============================================================
	// ШАГ 3: Анализ переведенного текста
	// ============================================================
	translatedTextEntity, err := entities.NewText(translatedText, targetLang.Code)
	if err != nil {
		return nil, fmt.Errorf("failed to create translated text entity: %w", err)
	}

	result.TranslatedAnalysis, err = uc.analyzer.Analyze(translatedTextEntity, targetLang)
	if err != nil {
		return nil, fmt.Errorf("failed to analyze translated text: %w", err)
	}

	// ============================================================
	// ШАГ 4: Обратный перевод на исходный язык (sw → ru)
	// ============================================================
	backTranslatedText, err := translator.Translate(ctx, translatedText, sourceLang)
	if err != nil {
		return nil, fmt.Errorf("failed to back-translate: %w", err)
	}

	result.BackTranslatedText = backTranslatedText

	// ============================================================
	// ШАГ 5: Анализ обратно переведенного текста
	// ============================================================
	backTranslatedTextEntity, err := entities.NewText(backTranslatedText, sourceLang.Code)
	if err != nil {
		return nil, fmt.Errorf("failed to create back-translated text entity: %w", err)
	}

	result.BackTranslatedAnalysis, err = uc.analyzer.Analyze(backTranslatedTextEntity, sourceLang)
	if err != nil {
		return nil, fmt.Errorf("failed to analyze back-translated text: %w", err)
	}

	// ============================================================
	// ШАГ 6: Сравнение оригинала и обратного перевода
	// ============================================================
	comparison := result.CompareWithOriginal()

	return &TranslateAndAnalyzeOutput{
		TranslationResult: result,
		Comparison:        comparison,
	}, nil
}
