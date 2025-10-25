package translators

import (
	"context"
	"errors"
	"textropy/internal/domain/valueobjects"
)

var (
	ErrUnsupportedLanguage = errors.New("unsupported language")
	ErrTranslationFailed   = errors.New("translation failed")
	ErrAPIKeyMissing       = errors.New("API key is missing")
)

// Translator интерфейс для переводчиков
type Translator interface {
	Translate(ctx context.Context, text string, targetLang valueobjects.Language) (string, error)
	Name() string
	IsAvailable() bool
}

// TranslatorFactory создает переводчик по типу
type TranslatorFactory struct {
	yandexAPIKey   string
	yandexFolderID string
}

func NewTranslatorFactory(yandexKey, yandexFolder string) *TranslatorFactory {
	return &TranslatorFactory{
		yandexAPIKey:   yandexKey,
		yandexFolderID: yandexFolder,
	}
}

func (f *TranslatorFactory) Create(translatorType valueobjects.TranslatorType) (Translator, error) {
	switch translatorType {
	case valueobjects.YandexTranslator:
		return NewYandexTranslator(f.yandexAPIKey, f.yandexFolderID), nil
	default:
		return nil, errors.New("unknown translator type")
	}
}
