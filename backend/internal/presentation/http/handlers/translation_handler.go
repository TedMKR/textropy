package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"textropy/internal/application/usecases"
	"textropy/internal/domain/entities"
	"textropy/internal/domain/valueobjects"
	"textropy/internal/presentation/dto"
)

// TranslationHandler обрабатывает HTTP запросы для перевода и анализа
type TranslationHandler struct {
	translateAndAnalyzeUseCase *usecases.TranslateAndAnalyzeUseCase
}

// NewTranslationHandler создает новый handler
func NewTranslationHandler(useCase *usecases.TranslateAndAnalyzeUseCase) *TranslationHandler {
	return &TranslationHandler{
		translateAndAnalyzeUseCase: useCase,
	}
}

// TranslateAndAnalyze godoc
// @Summary Полный цикл перевода и анализа
// @Description Выполняет перевод на целевой язык, обратный перевод и сравнение энтропий
// @Tags translation
// @Accept json
// @Produce json
// @Param request body dto.TranslateAndAnalyzeRequest true "Запрос на перевод и анализ"
// @Success 200 {object} dto.TranslateAndAnalyzeResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/translate-analyze [post]
func (h *TranslationHandler) TranslateAndAnalyze(c *gin.Context) {
	var req dto.TranslateAndAnalyzeRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error:   "invalid_request",
			Message: err.Error(),
		})
		return
	}

	// Создаем TranslatorType из строки
	translatorType, err := valueobjects.NewTranslatorType(req.Translator)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error:   "invalid_translator",
			Message: err.Error(),
		})
		return
	}

	// Выполняем полный цикл перевода и анализа
	input := usecases.TranslateAndAnalyzeInput{
		OriginalText:   req.Content,
		SourceLanguage: req.SourceLanguage,
		TargetLanguage: req.TargetLanguage,
		TranslatorType: translatorType,
	}

	output, err := h.translateAndAnalyzeUseCase.Execute(c.Request.Context(), input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error:   "translation_analysis_failed",
			Message: err.Error(),
		})
		return
	}

	// Преобразуем результат в DTO
	response := h.toTranslateAndAnalyzeResponse(output)

	c.JSON(http.StatusOK, response)
}

// toTranslateAndAnalyzeResponse преобразует domain entities в DTO
func (h *TranslationHandler) toTranslateAndAnalyzeResponse(
	output *usecases.TranslateAndAnalyzeOutput,
) dto.TranslateAndAnalyzeResponse {
	result := output.TranslationResult

	response := dto.TranslateAndAnalyzeResponse{
		ID:                 result.ID.String(),
		OriginalText:       result.OriginalText,
		OriginalLanguage:   result.OriginalLanguage,
		TranslatedText:     result.TranslatedText,
		TargetLanguage:     result.TargetLanguage,
		BackTranslatedText: result.BackTranslatedText,
		TranslatorUsed:     result.TranslatorUsed,
		CreatedAt:          result.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}

	// Преобразуем анализы в DTO
	response.OriginalAnalysis = h.analysisToDTO(result.OriginalAnalysis)
	response.TranslatedAnalysis = h.analysisToDTO(result.TranslatedAnalysis)
	response.BackTranslatedAnalysis = h.analysisToDTO(result.BackTranslatedAnalysis)

	// Преобразуем сравнение в DTO
	if output.Comparison != nil {
		response.Comparison = h.comparisonToDTO(output.Comparison)
	}

	return response
}

// analysisToDTO преобразует Analysis в AnalysisResponse DTO
func (h *TranslationHandler) analysisToDTO(analysis *entities.Analysis) dto.AnalysisResponse {
	letterStats := make([]dto.LetterStatDTO, 0, len(analysis.LetterFreq))

	for _, stat := range analysis.LetterFreq {
		letterStats = append(letterStats, dto.LetterStatDTO{
			Letter:       stat.Letter,
			Count:        stat.Count,
			Probability:  stat.Probability,
			Contribution: stat.Contribution,
		})
	}

	return dto.AnalysisResponse{
		ID:          analysis.ID.String(),
		Entropy:     analysis.Entropy,
		TotalWords:  analysis.TotalWords,
		Mean:        analysis.Mean,
		StdDev:      analysis.StdDev,
		LetterStats: letterStats,
		CreatedAt:   analysis.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}

// comparisonToDTO преобразует TranslationComparison в DTO
func (h *TranslationHandler) comparisonToDTO(comparison *entities.TranslationComparison) *dto.TranslationComparisonDTO {
	letterFreqChanges := make(map[string]*dto.LetterFreqChangeDTO)

	for letter, change := range comparison.LetterFreqChanges {
		letterFreqChanges[letter] = &dto.LetterFreqChangeDTO{
			Letter:              change.Letter,
			OriginalCount:       change.OriginalCount,
			BackTranslatedCount: change.BackTranslatedCount,
			OriginalProbability: change.OriginalProbability,
			BackTranslatedProb:  change.BackTranslatedProb,
			ProbabilityChange:   change.ProbabilityChange,
		}
	}

	return &dto.TranslationComparisonDTO{
		EntropyLoss:        comparison.EntropyLoss,
		EntropyLossPercent: comparison.EntropyLossPercent,
		MeanDifference:     comparison.MeanDifference,
		StdDevDifference:   comparison.StdDevDifference,
		LetterFreqChanges:  letterFreqChanges,
	}
}
