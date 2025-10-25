package config

import (
	"os"
	"strings"
)

type Config struct {
	Server      ServerConfig
	Translation TranslationConfig
	CORS        CORSConfig
}

type ServerConfig struct {
	Port    string
	GinMode string
}

type TranslationConfig struct {
	YandexAPIKey   string
	YandexFolderID string
}

type CORSConfig struct {
	AllowedOrigins []string
}

func Load() *Config {
	return &Config{
		Server: ServerConfig{
			Port:    getEnv("PORT", "8080"),
			GinMode: getEnv("GIN_MODE", "debug"),
		},
		Translation: TranslationConfig{
			YandexAPIKey:   getEnv("YANDEX_API_KEY", ""),
			YandexFolderID: getEnv("YANDEX_FOLDER_ID", ""),
		},
		CORS: CORSConfig{
			AllowedOrigins: strings.Split(
				getEnv("CORS_ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173"),
				",",
			),
		},
	}
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
