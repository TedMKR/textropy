package valueobjects

import "errors"

// TranslatorType представляет тип переводчика (Value Object)
type TranslatorType string

const (
	YandexTranslator TranslatorType = "yandex"
)

var (
	ErrInvalidTranslator = errors.New("invalid translator type")
)

// TranslatorConfig содержит конфигурацию переводчика
type TranslatorConfig struct {
	Type   TranslatorType
	APIKey string
	FolderID string // Для Yandex Translate
}

// IsValid проверяет валидность типа переводчика
func (t TranslatorType) IsValid() bool {
	return t == YandexTranslator
}

// String возвращает строковое представление переводчика
func (t TranslatorType) String() string {
	return string(t)
}

// NewTranslatorType создает новый тип переводчика
func NewTranslatorType(translator string) (TranslatorType, error) {
	t := TranslatorType(translator)
	if !t.IsValid() {
		return "", ErrInvalidTranslator
	}
	return t, nil
}
