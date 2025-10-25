package valueobjects

import "errors"

// Language представляет язык текста (Value Object)
type Language struct {
	Code string
	Name string
}

var (
	ErrUnsupportedLanguage = errors.New("unsupported language")
)

// Все поддерживаемые языки Yandex Translate (103 языка)
var (
	Afrikaans      = Language{Code: "af", Name: "Afrikaans"}
	Albanian       = Language{Code: "sq", Name: "Albanian"}
	Amharic        = Language{Code: "am", Name: "Amharic"}
	Arabic         = Language{Code: "ar", Name: "Arabic"}
	Armenian       = Language{Code: "hy", Name: "Armenian"}
	Azerbaijani    = Language{Code: "az", Name: "Azerbaijani"}
	Bashkir        = Language{Code: "ba", Name: "Bashkir"}
	Basque         = Language{Code: "eu", Name: "Basque"}
	Belarusian     = Language{Code: "be", Name: "Belarusian"}
	Bengali        = Language{Code: "bn", Name: "Bengali"}
	Bosnian        = Language{Code: "bs", Name: "Bosnian"}
	Bulgarian      = Language{Code: "bg", Name: "Bulgarian"}
	Burmese        = Language{Code: "my", Name: "Burmese"}
	Catalan        = Language{Code: "ca", Name: "Catalan"}
	Cebuano        = Language{Code: "ceb", Name: "Cebuano"}
	Chinese        = Language{Code: "zh", Name: "Chinese"}
	Chuvash        = Language{Code: "cv", Name: "Chuvash"}
	Croatian       = Language{Code: "hr", Name: "Croatian"}
	Czech          = Language{Code: "cs", Name: "Czech"}
	Danish         = Language{Code: "da", Name: "Danish"}
	Dutch          = Language{Code: "nl", Name: "Dutch"}
	English        = Language{Code: "en", Name: "English"}
	Esperanto      = Language{Code: "eo", Name: "Esperanto"}
	Estonian       = Language{Code: "et", Name: "Estonian"}
	Finnish        = Language{Code: "fi", Name: "Finnish"}
	French         = Language{Code: "fr", Name: "French"}
	Galician       = Language{Code: "gl", Name: "Galician"}
	Georgian       = Language{Code: "ka", Name: "Georgian"}
	German         = Language{Code: "de", Name: "German"}
	Greek          = Language{Code: "el", Name: "Greek"}
	Gujarati       = Language{Code: "gu", Name: "Gujarati"}
	HaitianCreole  = Language{Code: "ht", Name: "Haitian Creole"}
	Hebrew         = Language{Code: "he", Name: "Hebrew"}
	HillMari       = Language{Code: "mrj", Name: "Hill Mari"}
	Hindi          = Language{Code: "hi", Name: "Hindi"}
	Hungarian      = Language{Code: "hu", Name: "Hungarian"}
	Icelandic      = Language{Code: "is", Name: "Icelandic"}
	Indonesian     = Language{Code: "id", Name: "Indonesian"}
	Irish          = Language{Code: "ga", Name: "Irish"}
	Italian        = Language{Code: "it", Name: "Italian"}
	Japanese       = Language{Code: "ja", Name: "Japanese"}
	Javanese       = Language{Code: "jv", Name: "Javanese"}
	Kannada        = Language{Code: "kn", Name: "Kannada"}
	Kazakh         = Language{Code: "kk", Name: "Kazakh"}
	Khmer          = Language{Code: "km", Name: "Khmer"}
	Komi           = Language{Code: "kv", Name: "Komi"}
	Korean         = Language{Code: "ko", Name: "Korean"}
	Kyrgyz         = Language{Code: "ky", Name: "Kyrgyz"}
	Lao            = Language{Code: "lo", Name: "Lao"}
	Latin          = Language{Code: "la", Name: "Latin"}
	Latvian        = Language{Code: "lv", Name: "Latvian"}
	Lithuanian     = Language{Code: "lt", Name: "Lithuanian"}
	Luxembourgish  = Language{Code: "lb", Name: "Luxembourgish"}
	Macedonian     = Language{Code: "mk", Name: "Macedonian"}
	Malagasy       = Language{Code: "mg", Name: "Malagasy"}
	Malay          = Language{Code: "ms", Name: "Malay"}
	Malayalam      = Language{Code: "ml", Name: "Malayalam"}
	Maltese        = Language{Code: "mt", Name: "Maltese"}
	Maori          = Language{Code: "mi", Name: "Maori"}
	Marathi        = Language{Code: "mr", Name: "Marathi"}
	MeadowMari     = Language{Code: "mhr", Name: "Meadow Mari"}
	Moksha         = Language{Code: "mdf", Name: "Moksha"}
	Mongolian      = Language{Code: "mn", Name: "Mongolian"}
	Nepali         = Language{Code: "ne", Name: "Nepali"}
	Norwegian      = Language{Code: "no", Name: "Norwegian"}
	Ossetian       = Language{Code: "os", Name: "Ossetian"}
	Papiamento     = Language{Code: "pap", Name: "Papiamento"}
	Persian        = Language{Code: "fa", Name: "Persian"}
	Polish         = Language{Code: "pl", Name: "Polish"}
	Portuguese     = Language{Code: "pt", Name: "Portuguese"}
	Punjabi        = Language{Code: "pa", Name: "Punjabi"}
	Romanian       = Language{Code: "ro", Name: "Romanian"}
	Russian        = Language{Code: "ru", Name: "Russian"}
	ScottishGaelic = Language{Code: "gd", Name: "Scottish Gaelic"}
	Serbian        = Language{Code: "sr", Name: "Serbian"}
	Sinhala        = Language{Code: "si", Name: "Sinhala"}
	Slovak         = Language{Code: "sk", Name: "Slovak"}
	Slovenian      = Language{Code: "sl", Name: "Slovenian"}
	Spanish        = Language{Code: "es", Name: "Spanish"}
	Sundanese      = Language{Code: "su", Name: "Sundanese"}
	Swahili        = Language{Code: "sw", Name: "Swahili"}
	Swedish        = Language{Code: "sv", Name: "Swedish"}
	Tagalog        = Language{Code: "tl", Name: "Tagalog"}
	Tajik          = Language{Code: "tg", Name: "Tajik"}
	Tamil          = Language{Code: "ta", Name: "Tamil"}
	Tatar          = Language{Code: "tt", Name: "Tatar"}
	Telugu         = Language{Code: "te", Name: "Telugu"}
	Thai           = Language{Code: "th", Name: "Thai"}
	Turkish        = Language{Code: "tr", Name: "Turkish"}
	Tuvan          = Language{Code: "tyv", Name: "Tuvan"}
	Udmurt         = Language{Code: "udm", Name: "Udmurt"}
	Ukrainian      = Language{Code: "uk", Name: "Ukrainian"}
	Urdu           = Language{Code: "ur", Name: "Urdu"}
	Uzbek          = Language{Code: "uz", Name: "Uzbek"}
	Vietnamese     = Language{Code: "vi", Name: "Vietnamese"}
	Welsh          = Language{Code: "cy", Name: "Welsh"}
	Xhosa          = Language{Code: "xh", Name: "Xhosa"}
	Yakut          = Language{Code: "sah", Name: "Yakut"}
	Yiddish        = Language{Code: "yi", Name: "Yiddish"}
	Zulu           = Language{Code: "zu", Name: "Zulu"}
)

// AllLanguages возвращает список всех поддерживаемых языков
func AllLanguages() []Language {
	return []Language{
		Afrikaans, Albanian, Amharic, Arabic, Armenian, Azerbaijani,
		Bashkir, Basque, Belarusian, Bengali, Bosnian, Bulgarian, Burmese,
		Catalan, Cebuano, Chinese, Chuvash, Croatian, Czech, Danish, Dutch,
		English, Esperanto, Estonian, Finnish, French,
		Galician, Georgian, German, Greek, Gujarati,
		HaitianCreole, Hebrew, HillMari, Hindi, Hungarian,
		Icelandic, Indonesian, Irish, Italian, Japanese, Javanese,
		Kannada, Kazakh, Khmer, Komi, Korean, Kyrgyz,
		Lao, Latin, Latvian, Lithuanian, Luxembourgish,
		Macedonian, Malagasy, Malay, Malayalam, Maltese, Maori, Marathi, MeadowMari, Moksha, Mongolian,
		Nepali, Norwegian, Ossetian,
		Papiamento, Persian, Polish, Portuguese, Punjabi,
		Romanian, Russian,
		ScottishGaelic, Serbian, Sinhala, Slovak, Slovenian, Spanish, Sundanese, Swahili, Swedish,
		Tagalog, Tajik, Tamil, Tatar, Telugu, Thai, Turkish, Tuvan,
		Udmurt, Ukrainian, Urdu, Uzbek,
		Vietnamese, Welsh,
		Xhosa, Yakut, Yiddish,
		Zulu,
	}
}

// RussianAlphabet - русский алфавит для энтропийного анализа
var RussianAlphabet = []string{
	"а", "б", "в", "г", "д", "е", "ж", "з", "и", "к", "л", "м", "н", "о",
	"п", "р", "с", "т", "у", "ф", "х", "ц", "ч", "ш", "щ", "э", "ю", "я",
}

// EnglishAlphabet - английский алфавит для энтропийного анализа
var EnglishAlphabet = []string{
	"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
	"n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
}

// SwahiliAlphabet - суахили алфавит (латинский)
var SwahiliAlphabet = []string{
	"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
	"n", "o", "p", "r", "s", "t", "u", "v", "w", "y", "z",
}

// NewLanguage создает новый объект языка по коду
func NewLanguage(code string) (Language, error) {
	// Проверяем все доступные языки
	for _, lang := range AllLanguages() {
		if lang.Code == code {
			return lang, nil
		}
	}
	return Language{}, ErrUnsupportedLanguage
}

// GetAlphabet возвращает алфави�� для данного языка
func (l Language) GetAlphabet() []string {
	switch l.Code {
	case "ru":
		return RussianAlphabet
	case "en":
		return EnglishAlphabet
	case "sw":
		return SwahiliAlphabet
	default:
		// Для других языков используем латинский алфавит
		return EnglishAlphabet
	}
}

// IsValid проверяет валидность языка
func (l Language) IsValid() bool {
	_, err := NewLanguage(l.Code)
	return err == nil
}
