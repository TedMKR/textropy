package main

import (
	"textropy/internal/application/services"
	"textropy/internal/application/usecases"
	"textropy/internal/infrastructure/translators"
	"textropy/internal/presentation/http"
	"textropy/internal/presentation/http/handlers"
	"textropy/pkg/config"
	"textropy/pkg/logger"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "textropy/docs"
)

// @title Textropy API
// @version 1.0
// @description API для энтропийного анализа текста
// @host localhost:8080
// @BasePath /
func main() {
	// Инициализация логгера
	log := logger.Init()
	log.Info("🚀 Запуск Textropy API...")

	// Загрузка конфигурации
	cfg := config.Load()
	log.Info("✅ Конфигурация загружена")

	// Установка режима Gin
	gin.SetMode(cfg.Server.GinMode)

	// Создаем Gin router
	router := gin.Default()

	// Dependency Injection (Clean Architecture)
	// Infrastructure Layer
	translatorFactory := translators.NewTranslatorFactory(
		cfg.Translation.YandexAPIKey,
		cfg.Translation.YandexFolderID,
	)

	// Application Layer - Services
	textAnalyzer := services.NewTextAnalyzer()

	// Application Layer - Use Cases
	analyzeUseCase := usecases.NewAnalyzeTextUseCase(textAnalyzer)
	translateAndAnalyzeUseCase := usecases.NewTranslateAndAnalyzeUseCase(textAnalyzer, translatorFactory)

	// Presentation Layer - Handlers
	analysisHandler := handlers.NewAnalysisHandler(analyzeUseCase)
	translationHandler := handlers.NewTranslationHandler(translateAndAnalyzeUseCase)
	languageHandler := handlers.NewLanguageHandler()

	// Setup routes with CORS
	http.SetupRoutes(router, analysisHandler, translationHandler, languageHandler)

	// Swagger UI
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Start server
	port := ":" + cfg.Server.Port
	log.Info("🎯 Сервер запущен на порту %s", port)
	log.Info("📚 Swagger доступен по адресу: http://localhost:%s/swagger/index.html", cfg.Server.Port)

	if translatorFactory != nil {
		log.Info("🌐 Сервис переводов инициализирован")
	}

	if err := router.Run(port); err != nil {
		log.Fatal("❌ Не удалось запустить сервер: %v", err)
	}
}
