package dto

// TranslateAndAnalyzeRequest - запрос на полный цикл перевода и анализа
type TranslateAndAnalyzeRequest struct {
	Content        string `json:"content" binding:"required"`
	SourceLanguage string `json:"source_language" binding:"required"` // ru, en
	TargetLanguage string `json:"target_language" binding:"required"` // sw, en (промежуточный язык)
	Translator     string `json:"translator" binding:"required"`      // yandex, google, deepl
}

// LetterFreqChangeDTO - изменение частоты буквы
type LetterFreqChangeDTO struct {
	Letter              string  `json:"letter"`
	OriginalCount       int     `json:"original_count"`
	BackTranslatedCount int     `json:"back_translated_count"`
	OriginalProbability float64 `json:"original_probability"`
	BackTranslatedProb  float64 `json:"back_translated_probability"`
	ProbabilityChange   float64 `json:"probability_change"`
}

// TranslationComparisonDTO - сравнение энтропий
type TranslationComparisonDTO struct {
	EntropyLoss        float64                         `json:"entropy_loss"`
	EntropyLossPercent float64                         `json:"entropy_loss_percent"`
	MeanDifference     float64                         `json:"mean_difference"`
	StdDevDifference   float64                         `json:"std_dev_difference"`
	LetterFreqChanges  map[string]*LetterFreqChangeDTO `json:"letter_freq_changes"`
}

// TranslateAndAnalyzeResponse - ответ с полным результатом
type TranslateAndAnalyzeResponse struct {
	ID string `json:"id"`

	// Оригинальный текст и анализ
	OriginalText     string           `json:"original_text"`
	OriginalLanguage string           `json:"original_language"`
	OriginalAnalysis AnalysisResponse `json:"original_analysis"`

	// Переведенный текст и анализ
	TranslatedText     string           `json:"translated_text"`
	TargetLanguage     string           `json:"target_language"`
	TranslatedAnalysis AnalysisResponse `json:"translated_analysis"`

	// Обратно переведенный текст и анализ
	BackTranslatedText     string           `json:"back_translated_text"`
	BackTranslatedAnalysis AnalysisResponse `json:"back_translated_analysis"`

	// Сравнение
	Comparison *TranslationComparisonDTO `json:"comparison"`

	// Метаданные
	TranslatorUsed string `json:"translator_used"`
	CreatedAt      string `json:"created_at"`
}
