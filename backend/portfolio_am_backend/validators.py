import os

from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible

# Extensões aceites para upload de imagens em todo o site.
# Nota: o Django ImageField já valida com Pillow que o ficheiro é uma imagem
# genuína (não apenas a extensão), o que por si só bloqueia SVG e ficheiros
# disfarçados. Esta whitelist é uma camada adicional, explícita, sobre os
# formatos que o site realmente precisa de suportar.
ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}


@deconstructible
class ImageFileValidator:
    """
    Valida ficheiros de imagem enviados através do Django Admin:
    - extensão dentro da whitelist
    - tamanho máximo (MAX_UPLOAD_SIZE_MB, definido em settings/.env)

    Usar em conjunto com o ImageField (que já valida o conteúdo com Pillow).
    """

    def __call__(self, file):
        ext = os.path.splitext(file.name)[1].lower()
        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            raise ValidationError(
                f'Formato de ficheiro não suportado ("{ext}"). '
                f'Formatos aceites: {", ".join(sorted(ALLOWED_IMAGE_EXTENSIONS))}.'
            )

        max_mb = getattr(settings, 'MAX_UPLOAD_SIZE_MB', 10)
        max_bytes = max_mb * 1024 * 1024
        if file.size > max_bytes:
            raise ValidationError(
                f'O ficheiro é demasiado grande ({file.size / (1024 * 1024):.1f} MB). '
                f'O tamanho máximo permitido é {max_mb} MB.'
            )

    def __eq__(self, other):
        return isinstance(other, ImageFileValidator)


validate_image_file = ImageFileValidator()
