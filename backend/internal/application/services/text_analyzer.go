package services

import (
	"strings"
	"textropy/internal/domain/entities"
	"textropy/internal/domain/valueobjects"
	"unicode"
)

// TextAnalyzer выполняет энтропийный анализ текста
type TextAnalyzer struct{}

// NewTextAnalyzer создает новый анализатор текста
func NewTextAnalyzer() *TextAnalyzer {
	return &TextAnalyzer{}
}

// Analyze выполняет полный энтропийный анализ текста по начальной букве
// Алгоритм основан на документе "Практическая работа № 36"
func (ta *TextAnalyzer) Analyze(text *entities.Text, language valueobjects.Language) (*entities.Analysis, error) {
	analysis := entities.NewAnalysis(text.ID)

	// Получаем алфавит для языка
	alphabet := language.GetAlphabet()

	// Инициализируем статистику для каждой буквы алфавита
	for _, letter := range alphabet {
		analysis.LetterFreq[letter] = &entities.LetterStat{
			Letter: letter,
			Count:  0,
		}
	}

	// Подсчитываем слова по начальной букве
	words := ta.extractWords(text.Content)
	analysis.TotalWords = len(words)

	for _, word := range words {
		if len(word) == 0 {
			continue
		}

		// Получаем первую букву слова в нижнем регистре
		firstLetter := strings.ToLower(string([]rune(word)[0]))

		// Если буква есть в алфавите, увеличиваем счетчик
		if stat, exists := analysis.LetterFreq[firstLetter]; exists {
			stat.Count++
		}
	}

	// Вычисляем вероятности Pi = ni/N
	for _, stat := range analysis.LetterFreq {
		if analysis.TotalWords > 0 {
			stat.Probability = float64(stat.Count) / float64(analysis.TotalWords)
		}
	}

	// Вычисляем энтропию по формуле Шеннона: H = -Σ(Pi * log2(Pi))
	analysis.CalculateEntropy()

	// Вычисляем статистические характеристики (χ и σ)
	analysis.CalculateStatistics()

	return analysis, nil
}

// extractWords извлекает слова из текста
func (ta *TextAnalyzer) extractWords(content string) []string {
	var words []string
	var currentWord strings.Builder

	for _, char := range content {
		if unicode.IsLetter(char) {
			currentWord.WriteRune(char)
		} else {
			if currentWord.Len() > 0 {
				words = append(words, currentWord.String())
				currentWord.Reset()
			}
		}
	}

	// Добавляем последнее слово, если оно есть
	if currentWord.Len() > 0 {
		words = append(words, currentWord.String())
	}

	return words
}

// GetSortedLetterStats возвращает статистику букв, отсортированную по убыванию вероятности
func (ta *TextAnalyzer) GetSortedLetterStats(analysis *entities.Analysis) []*entities.LetterStat {
	stats := make([]*entities.LetterStat, 0, len(analysis.LetterFreq))

	for _, stat := range analysis.LetterFreq {
		stats = append(stats, stat)
	}

	// Сортировка по убыванию вероятности (bubble sort для простоты)
	for i := 0; i < len(stats); i++ {
		for j := i + 1; j < len(stats); j++ {
			if stats[i].Probability < stats[j].Probability {
				stats[i], stats[j] = stats[j], stats[i]
			}
		}
	}

	return stats
}
