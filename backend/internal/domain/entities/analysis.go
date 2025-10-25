package entities

import (
	"github.com/google/uuid"
	"math"
	"time"
)

// Analysis представляет результаты энтропийного анализа текста
type Analysis struct {
	ID         uuid.UUID
	TextID     uuid.UUID
	Entropy    float64                // H - информационная энтропия
	TotalWords int                    // N - общее количество слов
	Mean       float64                // χ (chi) - математическое ожидание
	StdDev     float64                // σ (sigma) - среднее квадратичное отклонение
	LetterFreq map[string]*LetterStat // Статистика по буквам
	CreatedAt  time.Time
}

// LetterStat хранит статистику для каждой буквы
type LetterStat struct {
	Letter       string
	Count        int
	Probability  float64 // Pi
	Contribution float64 // Pi*Log(Pi;2)
}

// NewAnalysis создает новый результат анализа
func NewAnalysis(textID uuid.UUID) *Analysis {
	return &Analysis{
		ID:         uuid.New(),
		TextID:     textID,
		LetterFreq: make(map[string]*LetterStat),
		CreatedAt:  time.Now(),
	}
}

// CalculateEntropy вычисляет информационную энтропию по формуле Шеннона
// H = -Σ(Pi * log2(Pi))
func (a *Analysis) CalculateEntropy() {
	entropy := 0.0

	for _, stat := range a.LetterFreq {
		if stat.Probability > 0 {
			contribution := -stat.Probability * math.Log2(stat.Probability)
			stat.Contribution = contribution
			entropy += contribution
		}
	}

	a.Entropy = entropy
}

// CalculateStatistics вычисляет статистические характеристики
// χ (математическое ожидание) и σ (среднее квадратичное отклонение)
func (a *Analysis) CalculateStatistics() {
	// Вычисляем математическое ожидание: χ = Σ(x * Pi)
	mean := 0.0
	letterIndex := 1

	for _, stat := range a.LetterFreq {
		mean += float64(letterIndex) * stat.Probability
		letterIndex++
	}

	a.Mean = mean

	// Вычисляем дисперсию и стандартное отклонение: σ = sqrt(Σ((x - χ)² * Pi))
	variance := 0.0
	letterIndex = 1

	for _, stat := range a.LetterFreq {
		diff := float64(letterIndex) - mean
		variance += diff * diff * stat.Probability
		letterIndex++
	}

	a.StdDev = math.Sqrt(variance)
}

// IsValid проверяет валидность результатов анализа
func (a *Analysis) IsValid() bool {
	return a.Entropy > 0 && a.TotalWords > 0
}
