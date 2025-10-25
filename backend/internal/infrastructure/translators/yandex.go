package translators

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"textropy/internal/domain/valueobjects"
)

type YandexTranslator struct {
	apiKey     string
	folderID string
	httpClient *http.Client
}

type yandexTranslateRequest struct {
	FolderID       string   `json:"folderId,omitempty"`
	Texts          []string `json:"texts"`
	TargetLanguage string   `json:"targetLanguageCode"`
	SourceLanguage string   `json:"sourceLanguageCode,omitempty"`
}

type yandexTranslateResponse struct {
	Translations []struct {
		Text string `json:"text"`
	} `json:"translations"`
}

func NewYandexTranslator(apiKey string, folderID string) *YandexTranslator {
	return &YandexTranslator{
		apiKey:     apiKey,
		folderID: folderID,
		httpClient: &http.Client{},
	}
}

func (y *YandexTranslator) Name() string {
	return "Yandex Translate"
}

func (y *YandexTranslator) IsAvailable() bool {
	return y.apiKey != ""
}

func (y *YandexTranslator) Translate(ctx context.Context, text string, targetLang valueobjects.Language) (string, error) {
	if !y.IsAvailable() {
		return "", ErrAPIKeyMissing
	}

	targetCode := languageToYandexCode(targetLang)
	if targetCode == "" {
		return "", ErrUnsupportedLanguage
	}

	reqBody := yandexTranslateRequest{
		FolderID: y.folderID,
		Texts:          []string{text},
		TargetLanguage: targetCode,
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST",
		"https://translate.api.cloud.yandex.net/translate/v2/translate",
		bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Api-Key %s", y.apiKey))

	resp, err := y.httpClient.Do(req)
	if err != nil {
		return "", ErrTranslationFailed
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("yandex API returned status %d: %s", resp.StatusCode, string(body))
	}

	var result yandexTranslateResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", fmt.Errorf("failed to decode response: %w", err)
	}

	if len(result.Translations) == 0 {
		return "", ErrTranslationFailed
	}

	return result.Translations[0].Text, nil
}

func languageToYandexCode(lang valueobjects.Language) string {
	// Yandex Translate API использует те же коды языков, что и мы
	if lang.IsValid() {
		return lang.Code
	}
	return ""
}
