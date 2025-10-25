package entities

import (
	"github.com/google/uuid"
	"time"
)

// TranslationResult представляет результат полного цикла перевода и анализа
type TranslationResult struct {
	ID uuid.UUID

	// Оригинальный текст
	OriginalText     string
	OriginalLanguage string
	OriginalAnalysis *Analysis

	// Перевод на целевой язык
	TranslatedText     string
	TargetLanguage     string
	TranslatedAnalysis *Analysis

	// Обратный перевод
	BackTranslatedText     string
	BackTranslatedAnalysis *Analysis

	// Метаданные
	TranslatorUsed string
	CreatedAt      time.Time
}

// TranslationComparison содержит сравнение энтропий
type TranslationComparison struct {
	// Изменение энтропии
	EntropyLoss        float64 // H_original - H_back
	EntropyLossPercent float64 // (H_original - H_back) / H_original * 100

	// Изменение статистики
	MeanDifference   float64
	StdDevDifference float64

	// Изменения в распределении букв
	LetterFreqChanges map[string]*LetterFreqChange
}

// LetterFreqChange показывает изменение частоты буквы
type LetterFreqChange struct {
	Letter              string
	OriginalCount       int
	BackTranslatedCount int
	OriginalProbability float64
	BackTranslatedProb  float64
	ProbabilityChange   float64 // разница вероятностей
}

// NewTranslationResult создает новый результат перевода
func NewTranslationResult(originalText, originalLang, translatorUsed string) *TranslationResult {
	return &TranslationResult{
		ID:               uuid.New(),
		OriginalText:     originalText,
		OriginalLanguage: originalLang,
		TranslatorUsed:   translatorUsed,
		CreatedAt:        time.Now(),
	}
}

// CompareWithOriginal сравнивает обратный перевод с оригиналом
func (tr *TranslationResult) CompareWithOriginal() *TranslationComparison {
	if tr.OriginalAnalysis == nil || tr.BackTranslatedAnalysis == nil {
		return nil
	}

	comparison := &TranslationComparison{
		LetterFreqChanges: make(map[string]*LetterFreqChange),
	}

	// Вычисляем потерю энтропии
	comparison.EntropyLoss = tr.OriginalAnalysis.Entropy - tr.BackTranslatedAnalysis.Entropy
	if tr.OriginalAnalysis.Entropy > 0 {
		comparison.EntropyLossPercent = (comparison.EntropyLoss / tr.OriginalAnalysis.Entropy) * 100
	}

	// Вычисляем разницу в статистических характеристиках
	comparison.MeanDifference = tr.OriginalAnalysis.Mean - tr.BackTranslatedAnalysis.Mean
	comparison.StdDevDifference = tr.OriginalAnalysis.StdDev - tr.BackTranslatedAnalysis.StdDev

	// Сравниваем частоты букв
	for letter, origStat := range tr.OriginalAnalysis.LetterFreq {
		backStat, exists := tr.BackTranslatedAnalysis.LetterFreq[letter]

		change := &LetterFreqChange{
			Letter:              letter,
			OriginalCount:       origStat.Count,
			OriginalProbability: origStat.Probability,
		}

		if exists {
			change.BackTranslatedCount = backStat.Count
			change.BackTranslatedProb = backStat.Probability
		}

		change.ProbabilityChange = change.OriginalProbability - change.BackTranslatedProb
		comparison.LetterFreqChanges[letter] = change
	}

	return comparison
}

// IsComplete проверяет, завершен ли полный цикл перевода
func (tr *TranslationResult) IsComplete() bool {
	return tr.OriginalAnalysis != nil &&
		tr.TranslatedAnalysis != nil &&
		tr.BackTranslatedAnalysis != nil &&
		tr.TranslatedText != "" &&
		tr.BackTranslatedText != ""
}
