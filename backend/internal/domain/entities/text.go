package entities

import (
	"time"

	"github.com/google/uuid"
)

// Text представляет текст для анализа (Domain Entity)
type Text struct {
	ID         uuid.UUID
	Content    string
	Language   string
	WordCount  int
	CharCount  int
	UploadedAt time.Time
}

// NewText - фабричный метод для создания нового текста
func NewText(content string, language string) (*Text, error) {
	if content == "" {
		return nil, ErrEmptyContent
	}

	text := &Text{
		ID:         uuid.New(),
		Content:    content,
		Language:   language,
		WordCount:  countWords(content),
		CharCount:  len(content),
		UploadedAt: time.Now(),
	}

	return text, nil
}

// countWords подсчитывает количество слов в тексте
func countWords(content string) int {
	// Упрощенная версия - разделение по пробелам
	words := 0
	inWord := false

	for _, char := range content {
		if char == ' ' || char == '\n' || char == '\t' {
			inWord = false
		} else if !inWord {
			words++
			inWord = true
		}
	}

	return words
}
