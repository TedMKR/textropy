package dto

// AnalyzeRequest - запрос на анализ текста
type AnalyzeRequest struct {
	Content    string `json:"content" binding:"required"`
	Language   string `json:"language" binding:"required"`
	Translator string `json:"translator,omitempty"` // yandex, google, deepl
}

// LetterStatDTO - статистика по букве
type LetterStatDTO struct {
	Letter       string  `json:"letter"`
	Count        int     `json:"count"`
	Probability  float64 `json:"probability"`
	Contribution float64 `json:"contribution"`
}

// AnalysisResponse - ответ с результатами анализа
type AnalysisResponse struct {
	ID          string          `json:"id"`
	Entropy     float64         `json:"entropy"`
	TotalWords  int             `json:"total_words"`
	Mean        float64         `json:"mean"`
	StdDev      float64         `json:"std_dev"`
	LetterStats []LetterStatDTO `json:"letter_stats"`
	CreatedAt   string          `json:"created_at"`
}

// ErrorResponse - ответ с ошибкой
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
}
