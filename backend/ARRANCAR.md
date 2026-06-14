# Como arrancar o projecto

## 1. Instalar dependências

```bash
cd portfolio-am-backend
pip install -r requirements.txt
```

## 2. Verificar o .env

O ficheiro `.env` já está configurado com `DEBUG=True` e as credenciais do Cloudinary.
**Não alteres as credenciais do Cloudinary.**

## 3. Aplicar migrações (IMPORTANTE — só fazer uma vez)

```bash
python manage.py migrate
```

Isto vai adicionar os novos campos (`slug`, `visivel`, `serie`, etc.) sem apagar dados existentes.

## 4. Gerar slugs para obras existentes

```bash
python manage.py shell -c "
from obras.models import Obra
for o in Obra.objects.filter(slug=''):
    o.save()
    print(f'slug gerado: {o.slug}')
print('Feito!')
"
```

## 5. Arrancar o servidor

```bash
python manage.py runserver
```

## 6. Testar a API

- Obras: http://localhost:8000/api/obras/
- Destaque: http://localhost:8000/api/obras/destaque/
- Disponíveis: http://localhost:8000/api/obras/disponiveis/
- Galeria: http://localhost:8000/api/galeria/
- Admin: http://localhost:8000/admin/

## Nota sobre imagens

As imagens estão no Cloudinary (`dtmxuje9a`). As URLs devolvidas pela API
começam por `https://res.cloudinary.com/` e funcionam directamente no frontend.

Se adicionares uma obra nova no admin e a imagem não aparecer,
verifica se o Cloudinary está configurado correctamente no `.env`.
