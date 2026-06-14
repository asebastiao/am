from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from biografia.models import Biografia
from contacto.models import ConfiguracaoContato
from obras.models import Obra
from galeria.models import ItemGaleria


class Command(BaseCommand):
    help = 'Configura dados iniciais para o portfólio'

    def handle(self, *args, **options):
        self.stdout.write('Configurando dados iniciais...')
        
        # Criar biografia inicial
        biografia, created = Biografia.objects.get_or_create(
            pk=1,
            defaults={
                'nome': 'Azevedo Muhanguena',
                'texto': '''
Azevedo Muhanguena é um artista plástico contemporâneo nascido em Lisboa em 1975. 
Formado pela Faculdade de Belas Artes da Universidade de Lisboa, desenvolveu ao longo 
de sua carreira uma linguagem visual única que transita entre o figurativo e o abstrato.

Sua obra é caracterizada pelo uso expressivo da cor e pela exploração de temas que 
abordam a condição humana contemporânea. Influenciado por movimentos como o 
expressionismo e o surrealismo, o artista busca estabelecer conexões emocionais 
profundas com o espectador através de suas criações.

Com mais de 20 anos de carreira, já participou de diversas exposições individuais 
e coletivas, tanto em Portugal quanto no exterior. Suas obras fazem parte de 
coleções privadas e públicas importantes.
                '''.strip(),
                'local_nascimento': 'Lisboa, Portugal',
                'formacao': 'Licenciatura em Artes Plásticas - Faculdade de Belas Artes, Universidade de Lisboa',
                'email_contato': 'contato@azevedomuhanguena.com',
                'telefone': '+351 123 456 789',
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Biografia criada'))
        else:
            self.stdout.write('• Biografia já existe')
        
        # Criar configuração de contato
        config, created = ConfiguracaoContato.objects.get_or_create(
            pk=1,
            defaults={
                'email_notificacao': 'contato@azevedomuhanguena.com',
                'enviar_email_automatico': True,
                'mensagem_agradecimento': 'Obrigado pela sua mensagem! Entraremos em contato em breve.',
                'ativo': True,
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Configuração de contato criada'))
        else:
            self.stdout.write('• Configuração de contato já existe')
        
        # Criar algumas obras de exemplo
        obras_exemplo = [
            {
                'titulo': 'Abstração em Azul',
                'descricao': 'Uma exploração de formas abstratas em tons de azul, inspirada no movimento expressionista abstrato.',
                'tecnica': 'Óleo sobre tela',
                'dimensoes': '100 x 80 cm',
                'ano_criacao': 2022,
                'disponivel': True,
                'destaque': True,
            },
            {
                'titulo': 'Paisagem Urbana',
                'descricao': 'Representação da vida urbana contemporânea, com elementos arquitetônicos e figuras humanas em movimento.',
                'tecnica': 'Acrílica sobre tela',
                'dimensoes': '120 x 90 cm',
                'ano_criacao': 2021,
                'disponivel': False,
                'destaque': True,
            },
            {
                'titulo': 'Natureza Morta',
                'descricao': 'Composição clássica de natureza morta, com frutas e objetos do cotidiano.',
                'tecnica': 'Aquarela sobre papel',
                'dimensoes': '50 x 70 cm',
                'ano_criacao': 2023,
                'disponivel': True,
                'destaque': False,
            },
        ]
        
        obras_criadas = 0
        for obra_data in obras_exemplo:
            obra, created = Obra.objects.get_or_create(
                titulo=obra_data['titulo'],
                defaults=obra_data
            )
            if created:
                obras_criadas += 1
        
        if obras_criadas > 0:
            self.stdout.write(self.style.SUCCESS(f'✓ {obras_criadas} obra(s) de exemplo criada(s)'))
        else:
            self.stdout.write('• Obras de exemplo já existem')
        
        self.stdout.write(self.style.SUCCESS('\nConfiguração inicial concluída!'))
        self.stdout.write('\nPróximos passos:')
        self.stdout.write('1. Acesse o admin em /admin/')
        self.stdout.write('2. Faça upload das imagens das obras')
        self.stdout.write('3. Configure a biografia com foto do artista')
        self.stdout.write('4. Adicione itens à galeria')
