import { useState, useEffect, useCallback } from 'react';
import manualDict from '../messages/dynamic-content.json';

// ── In-memory cache ──────────────────────────────────────────────────────────
// Keyed by `${locale}::${text}`. Persists for the lifetime of the JS runtime
// (in SSR that means per-request; in CSR it survives until page reload).
const cache = new Map<string, string>();

/**
 * Translates a single string from Portuguese to the target locale.
 * 1. Returns immediately if locale is 'pt'.
 * 2. Checks the manual dictionary (dynamic-content.json).
 * 3. Checks the in-memory cache.
 * 4. Calls the Google Translate public endpoint as a last resort.
 * Falls back to the original Portuguese text on any error.
 */
export async function translateDynamicAsync(
  text: string,
  locale: string,
): Promise<string> {
  if (!text || locale === 'pt') return text;

  const trimmed = text.trim();
  if (!trimmed) return text;

  // 1. Manual dictionary lookup (instant)
  const dict = manualDict as Record<string, string>;
  if (dict[trimmed]) return dict[trimmed];

  // 2. Cache lookup
  const cacheKey = `${locale}::${trimmed}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  // 3. Google Translate public endpoint
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=${locale}&dt=t&q=${encodeURIComponent(trimmed)}`;
    const res = await fetch(url);
    if (!res.ok) return text;

    const data = await res.json();
    // Response shape: [[["translated","original",null,null,10]],null,"pt",...]
    const translated = (data?.[0] as Array<[string]>)
      ?.map((seg: [string]) => seg[0])
      .join('') ?? text;

    cache.set(cacheKey, translated);
    return translated;
  } catch {
    return text;
  }
}

/**
 * Translates an array of strings in one batch call.
 * Google Translate supports multi-sentence input separated by newlines,
 * so we batch everything into a single HTTP request.
 */
export async function translateBatchAsync(
  texts: string[],
  locale: string,
): Promise<string[]> {
  if (!texts.length || locale === 'pt') return texts;

  // Separate texts that are already resolved vs those that need API translation
  const dict = manualDict as Record<string, string>;
  const results: (string | null)[] = texts.map(() => null);
  const toTranslate: { index: number; text: string }[] = [];

  for (let i = 0; i < texts.length; i++) {
    const trimmed = (texts[i] ?? '').trim();
    if (!trimmed) {
      results[i] = texts[i];
      continue;
    }
    // Manual dict
    if (dict[trimmed]) {
      results[i] = dict[trimmed];
      continue;
    }
    // Cache
    const cacheKey = `${locale}::${trimmed}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      results[i] = cached;
      continue;
    }
    toTranslate.push({ index: i, text: trimmed });
  }

  // If everything was already resolved, return
  if (toTranslate.length === 0) {
    return results as string[];
  }

  // Batch call: join with a unique separator that won't appear in normal text
  const separator = '\n\n';
  const batchText = toTranslate.map(t => t.text).join(separator);

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=${locale}&dt=t&q=${encodeURIComponent(batchText)}`;
    const res = await fetch(url);

    if (!res.ok) {
      // Fill in originals
      for (const item of toTranslate) results[item.index] = texts[item.index];
      return results as string[];
    }

    const data = await res.json();
    const fullTranslation = (data?.[0] as Array<[string]>)
      ?.map((seg: [string]) => seg[0])
      .join('') ?? batchText;

    // Split the translated batch back
    const translatedParts = fullTranslation.split(separator);

    for (let j = 0; j < toTranslate.length; j++) {
      const translated = (translatedParts[j] ?? texts[toTranslate[j].index]).trim();
      results[toTranslate[j].index] = translated;
      cache.set(`${locale}::${toTranslate[j].text}`, translated);
    }
  } catch {
    for (const item of toTranslate) results[item.index] = texts[item.index];
  }

  return results as string[];
}

/**
 * Synchronous fallback used during initial SSR render.
 * Checks manual dictionary and cache only — never calls an API.
 */
export function translateDynamic(text: string, locale: string): string {
  if (!text || locale === 'pt') return text;
  const trimmed = text.trim();
  const dict = manualDict as Record<string, string>;
  if (dict[trimmed]) return dict[trimmed];
  const cached = cache.get(`${locale}::${trimmed}`);
  if (cached) return cached;
  return text;
}

// ── React Hook ───────────────────────────────────────────────────────────────

/**
 * React hook that translates a Record of strings asynchronously.
 * Returns the translated record. On first render, shows original text,
 * then updates once translations arrive.
 *
 * Usage:
 *   const translated = useTranslateDynamic({ title: artwork.title, medium: artwork.medium }, locale);
 *   <h1>{translated.title}</h1>
 */
export function useTranslateDynamic<T extends Record<string, string>>(
  fields: T,
  locale: string,
): T {
  const [translated, setTranslated] = useState<T>(fields);

  const fieldValues = Object.values(fields).join('||');

  useEffect(() => {
    if (locale === 'pt') {
      setTranslated(fields);
      return;
    }

    let cancelled = false;
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    translateBatchAsync(values, locale).then((results) => {
      if (cancelled) return;
      const updated = {} as Record<string, string>;
      keys.forEach((key, i) => {
        updated[key] = results[i];
      });
      setTranslated(updated as T);
    });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, fieldValues]);

  return translated;
}

/**
 * React hook that translates an array of strings asynchronously.
 */
export function useTranslateDynamicArray(
  texts: string[],
  locale: string,
): string[] {
  const [translated, setTranslated] = useState<string[]>(texts);

  const textsKey = texts.join('||');

  useEffect(() => {
    if (locale === 'pt') {
      setTranslated(texts);
      return;
    }

    let cancelled = false;
    translateBatchAsync(texts, locale).then((results) => {
      if (cancelled) return;
      setTranslated(results);
    });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, textsKey]);

  return translated;
}
