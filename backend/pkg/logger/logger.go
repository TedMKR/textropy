package logger

import (
	"log"
	"os"
)

type Logger struct {
	info  *log.Logger
	warn  *log.Logger
	error *log.Logger
}

var instance *Logger

func Init() *Logger {
	if instance == nil {
		instance = &Logger{
			info:  log.New(os.Stdout, "INFO: ", log.Ldate|log.Ltime|log.Lshortfile),
			warn:  log.New(os.Stdout, "WARN: ", log.Ldate|log.Ltime|log.Lshortfile),
			error: log.New(os.Stderr, "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile),
		}
	}
	return instance
}

func Get() *Logger {
	if instance == nil {
		return Init()
	}
	return instance
}

func (l *Logger) Info(format string, v ...interface{}) {
	l.info.Printf(format, v...)
}

func (l *Logger) Warn(format string, v ...interface{}) {
	l.warn.Printf(format, v...)
}

func (l *Logger) Error(format string, v ...interface{}) {
	l.error.Printf(format, v...)
}

func (l *Logger) Fatal(format string, v ...interface{}) {
	l.error.Fatalf(format, v...)
}
