from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permite leitura (GET/HEAD/OPTIONS) a qualquer pessoa.
    Só permite escrita (POST/PUT/PATCH/DELETE) a utilizadores autenticados
    com is_staff=True (isto é, contas geridas no Django Admin).

    Usado nos ViewSets que expõem conteúdo público em modo leitura mas que,
    por serem ModelViewSet, também aceitam operações de escrita — essas
    operações devem ser feitas apenas através do Django Admin ou por uma
    conta de staff autenticada, nunca por um visitante anónimo do site.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)
