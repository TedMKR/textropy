package entities

import "errors"

var (
	ErrEmptyContent    = errors.New("content cannot be empty")
	ErrInvalidLanguage = errors.New("invalid language code")
	ErrAnalysisFailed  = errors.New("analysis failed")
)
