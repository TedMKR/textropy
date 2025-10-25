package dto

// LanguageDTO - DTO для языка
type LanguageDTO struct {
	Code string `json:"code"`
	Name string `json:"name"`
}

// LanguagesResponse - ответ со списком доступных языков
type LanguagesResponse struct {
	Languages []LanguageDTO `json:"languages"`
	Total     int           `json:"total"`
}
