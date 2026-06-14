# portfolio-am-backend
API REST do portfólio artístico de Azevedo Muhanguena, construída com Django e Django Rest Framework. Gerencia obras, galeria, biografia e contactos, com autenticação e estrutura pronta para deploy em produção.


---

## 🛠️ Backend (Django + DRF)**

### Estrutura recomendada:

```md
# Portfólio Azevedo Muhanguena – Backend

API REST que fornece os dados para o portfólio artístico de Azevedo Muhanguena. Desenvolvida com **Django** e **Django Rest Framework**, esta API gerencia obras, galeria, biografia e contatos.

---

## 🔧 Tecnologias

- [Django](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- PostgreSQL
- CORS Headers
- Gunicorn + Whitenoise (produção)

---

## 🚀 Como executar localmente

```bash
git clone https://github.com/seu-usuario/portfolio-azevedo-backend.git
cd portfolio-azevedo-backend
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate      # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
