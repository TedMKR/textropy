package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"textropy/internal/application/usecases"
	"textropy/internal/presentation/dto"
)

// AnalysisHandler обрабатывает HTTP запросы для анализа текста
type AnalysisHandler struct {
	analyzeUseCase *usecases.AnalyzeTextUseCase
}

// NewAnalysisHandler создает новый handler
func NewAnalysisHandler(analyzeUseCase *usecases.AnalyzeTextUseCase) *AnalysisHandler {
	return &AnalysisHandler{
		analyzeUseCase: analyzeUseCase,
	}
}

// AnalyzeText godoc
// @Summary Анализ текста
// @Description Выполняет энтропийный анализ текста по начальной букве
// @Tags analysis
// @Accept json
// @Produce json
// @Param request body dto.AnalyzeRequest true "Запрос на анализ"
// @Success 200 {object} dto.AnalysisResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/analyze [post]
func (h *AnalysisHandler) AnalyzeText(c *gin.Context) {
	var req dto.AnalyzeRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error:   "invalid_request",
			Message: err.Error(),
		})
		return
	}

	// Выполняем анализ
	input := usecases.AnalyzeTextInput{
		Content:  req.Content,
		Language: req.Language,
	}

	output, err := h.analyzeUseCase.Execute(c.Request.Context(), input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error:   "analysis_failed",
			Message: err.Error(),
		})
		return
	}

	// Преобразуем результат в DTO
	response := h.toAnalysisResponse(output)

	c.JSON(http.StatusOK, response)
}

// toAnalysisResponse преобразует результат анализа в DTO
func (h *AnalysisHandler) toAnalysisResponse(output *usecases.AnalyzeTextOutput) dto.AnalysisResponse {
	letterStats := make([]dto.LetterStatDTO, 0, len(output.SortedStats))

	for _, stat := range output.SortedStats {
		letterStats = append(letterStats, dto.LetterStatDTO{
			Letter:       stat.Letter,
			Count:        stat.Count,
			Probability:  stat.Probability,
			Contribution: stat.Contribution,
		})
	}

	return dto.AnalysisResponse{
		ID:          output.Analysis.ID.String(),
		Entropy:     output.Analysis.Entropy,
		TotalWords:  output.Analysis.TotalWords,
		Mean:        output.Analysis.Mean,
		StdDev:      output.Analysis.StdDev,
		LetterStats: letterStats,
		CreatedAt:   output.Analysis.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}

// Health godoc
// @Summary Health check
// @Description Проверка работоспособности API
// @Tags health
// @Produce json
// @Success 200 {object} map[string]string
// @Router /health [get]
func (h *AnalysisHandler) Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "ok",
		"service": "textropy-api",
	})
}
