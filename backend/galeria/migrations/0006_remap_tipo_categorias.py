from django.db import migrations


LEGACY_TO_NEW = {
    'evento': 'arquivo',
    'obra': 'arquivo',
    'outros': 'arquivo',
    # 'exposicao' mantém-se igual
}


def remap_tipo_forward(apps, schema_editor):
    ItemGaleria = apps.get_model('galeria', 'ItemGaleria')
    for old_value, new_value in LEGACY_TO_NEW.items():
        ItemGaleria.objects.filter(tipo=old_value).update(tipo=new_value)


def remap_tipo_backward(apps, schema_editor):
    # Não há forma de recuperar a categoria original (evento/obra/outros
    # foram todos fundidos em 'arquivo') — mantemos como está.
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('galeria', '0005_itemgaleria_destaque_alter_itemgaleria_tipo'),
    ]

    operations = [
        migrations.RunPython(remap_tipo_forward, remap_tipo_backward),
    ]
