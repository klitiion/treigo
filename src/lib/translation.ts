// Simple in-memory cache for translations
const translationCache: Record<string, string> = {};

interface TranslateRequest {
  q: string[];
  target: string;
  source?: string;
  format?: string;
}

export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'en'
): Promise<string> {
  if (!text || targetLanguage === 'en') {
    return text;
  }

  const cacheKey = `${text}-${targetLanguage}`;
  
  // Check cache first
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    const response = await fetch('https://translation.googleapis.com/language/translate/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: [text],
        target: targetLanguage,
        source: sourceLanguage,
        key: 'AIzaSyC4jugO7BTHNGo0h23Rxjjv_sBBMCcvj-o'
      })
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.data?.translations?.[0]?.translatedText || text;
    
    // Cache the result
    translationCache[cacheKey] = translatedText;
    
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

export async function translateMultiple(
  texts: string[],
  targetLanguage: string,
  sourceLanguage: string = 'en'
): Promise<string[]> {
  if (targetLanguage === 'en') {
    return texts;
  }

  try {
    const response = await fetch('https://translation.googleapis.com/language/translate/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: texts,
        target: targetLanguage,
        source: sourceLanguage,
        key: 'AIzaSyC4jugO7BTHNGo0h23Rxjjv_sBBMCcvj-o'
      })
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.translations?.map((t: any) => t.translatedText) || texts;
  } catch (error) {
    console.error('Translation error:', error);
    return texts;
  }
}

export const languages: Record<string, string> = {
  'en': 'English',
  'it': 'Italiano',
  'fr': 'Français'
};

export const languageCodes: Record<'en' | 'it' | 'fr', string> = {
  'en': 'en',
  'it': 'it',
  'fr': 'fr'
};
