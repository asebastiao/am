"""
Tradução automática PT → EN para o conteúdo do Django admin.

Fluxo: o dono do site escreve o conteúdo em Português no admin. Ao gravar,
`autotranslate_instance` verifica quais campos "_en" ficaram em branco e
preenche-os automaticamente traduzindo o respectivo campo "_pt". O campo
inglês continua 100% editável no admin — se o utilizador escrever algo à
mão, essa tradução manual é respeitada e nunca é substituída.

Se a chamada à API de tradução falhar (rede em baixo, limite atingido,
etc.), falhamos em silêncio e deixamos o campo em branco: o
MODELTRANSLATION_FALLBACK_LANGUAGES garante que, entretanto, o frontend
mostra o texto em Português como alternativa — o site nunca fica com
"buracos" de conteúdo.
"""
import logging

from django.conf import settings

logger = logging.getLogger(__name__)


def _translate_text(text: str) -> str | None:
    if not text or not text.strip():
        return None
    if not getattr(settings, 'AUTO_TRANSLATE_ENABLED', True):
        return None

    provider = getattr(settings, 'AUTO_TRANSLATE_PROVIDER', 'google')
    try:
        if provider == 'deepl':
            from deep_translator import DeeplTranslator
            api_key = getattr(settings, 'DEEPL_API_KEY', '')
            if not api_key:
                logger.warning('AUTO_TRANSLATE_PROVIDER=deepl mas DEEPL_API_KEY está vazio.')
                return None
            return DeeplTranslator(api_key=api_key, source='pt', target='en').translate(text)

        from deep_translator import GoogleTranslator
        return GoogleTranslator(source='pt', target='en').translate(text)
    except Exception:
        logger.exception('Falha na tradução automática pt→en; campo ficará em branco.')
        return None


def autotranslate_instance(instance, fields: list[str]) -> None:
    """Preenche <campo>_en a partir de <campo>_pt para os campos indicados,
    apenas quando <campo>_en estiver vazio (nunca sobrescreve edição manual).

    Uso (num save() de um model ou num signal pre_save):
        autotranslate_instance(self, ['titulo', 'descricao'])
    """
    for field in fields:
        pt_value = getattr(instance, f'{field}_pt', None)
        en_value = getattr(instance, f'{field}_en', None)
        if pt_value and not (en_value and en_value.strip()):
            translated = _translate_text(pt_value)
            if translated:
                setattr(instance, f'{field}_en', translated)
