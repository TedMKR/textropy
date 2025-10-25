package http

import (
	"github.com/gin-gonic/gin"
	"textropy/internal/presentation/http/handlers"
	"textropy/internal/presentation/http/middleware"
)

// SetupRoutes настраивает все роуты приложения
func SetupRoutes(
	router *gin.Engine,
	analysisHandler *handlers.AnalysisHandler,
	translationHandler *handlers.TranslationHandler,
	languageHandler *handlers.LanguageHandler,
) {
	// Middleware
	router.Use(middleware.DefaultCORS())
	router.Use(gin.Recovery())
	router.Use(gin.Logger())

	// Health check
	router.GET("/health", analysisHandler.Health)

	// API v1
	v1 := router.Group("/api/v1")
	{
		// Получить список поддерживаемых языков
		v1.GET("/languages", languageHandler.GetLanguages)

		// Анализ текста (без перевода)
		v1.POST("/analyze", analysisHandler.AnalyzeText)

		// Полный цикл перевода и анализа
		v1.POST("/translate-analyze", translationHandler.TranslateAndAnalyze)
	}
}
