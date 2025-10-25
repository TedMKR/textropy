package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"textropy/internal/domain/valueobjects"
	"textropy/internal/presentation/dto"
)

type LanguageHandler struct{}

func NewLanguageHandler() *LanguageHandler {
	return &LanguageHandler{}
}

// GetLanguages возвращает список всех поддерживаемых языков
func (h *LanguageHandler) GetLanguages(c *gin.Context) {
	allLanguages := valueobjects.AllLanguages()

	languageDTOs := make([]dto.LanguageDTO, len(allLanguages))
	for i, lang := range allLanguages {
		languageDTOs[i] = dto.LanguageDTO{
			Code: lang.Code,
			Name: lang.Name,
		}
	}

	response := dto.LanguagesResponse{
		Languages: languageDTOs,
		Total:     len(languageDTOs),
	}

	c.JSON(http.StatusOK, response)
}
