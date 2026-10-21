# ZUZ — Cidade do Preço | Tutorial completo e Mobile

Jogo educativo do TCC **ZUZ: Sistema Inteligente de Precificação para Micro e Pequenas Empresas**.

## Jogar

Abra `index.html` no Chrome ou Edge. Para disponibilizar no celular e instalar como aplicativo, publique a pasta em um endereço HTTPS (por exemplo, GitHub Pages). O jogo possui layout responsivo, barra de navegação inferior, menu "Mais", ícones instaláveis, manifesto PWA e cache offline após o primeiro acesso.

## Tutorial guiado (18 etapas)

Ao começar uma nova partida, o tutorial abre automaticamente. O botão **Próximo** apresenta a próxima função e navega para a página dela; **Voltar** retorna à etapa anterior; **Testar tela** pausa o tutorial para usar a tela sem perdê-lo; **Retomar tutorial** continua do mesmo ponto; **✕** fecha. É possível reiniciar o guia em **Como jogar**. O guia não altera o caixa nem compra produtos sozinho.

Áreas ensinadas: bairro, fornecedores, cálculo técnico, Zuni, produtos próprios, preço, simulações, interior e turnos, estoque, funcionários, clientes, eventos, mercado, notícias, expansão, segunda unidade, abertura e balanço.

## Funcionalidades preservadas

- Cadastro, edição e retirada de produtos personalizados
- Venda de produtos prontos e próprios, definição de preços e quantidades
- Atendimento aos clientes e demanda por perfil
- Estoque de ingredientes e compras, produção e custos variáveis
- Funcionários e salários, melhorias, expansão e segunda unidade
- Eventos, missões, Zuni com orientações simuladas, notícias e mercado fictício
- Ciclo manhã/tarde/noite, trilha, salvamento local e dias ilimitados

## Publicação no GitHub e em celulares

1. Entre em https://github.com/new e crie um repositório **público** chamado `zuz-cidade-do-preco` (não marque README ou `.gitignore`, pois os arquivos já vêm prontos).
2. Extraia este ZIP e envie os arquivos da pasta principal para a raiz do repositório, incluindo `.github/workflows/pages.yml`, `manifest.webmanifest`, `sw.js` e `icons/`.
3. Acesse **Settings → Pages → Build and deployment** e selecione **GitHub Actions**.
4. Aguarde a execução de **Actions → Publicar ZUZ no GitHub Pages**. A URL provável será `https://SEU-USUARIO.github.io/zuz-cidade-do-preco/` (apenas depois de publicada).
5. No Android, abra o endereço no Chrome e escolha **Instalar aplicativo** ou **Adicionar à tela inicial**. No iPhone, use Safari → **Compartilhar** → **Adicionar à Tela de Início**.

Os dados são salvos no armazenamento do navegador (localStorage), não sincronizam entre diferentes dispositivos e podem desaparecer se você limpar os dados do navegador. A música pode exigir interação inicial do usuário, dependendo do navegador.

## Tecnologias

HTML, CSS e JavaScript puro, sem frameworks. Service worker e manifesto da Web para PWA. Jogo offline educativo, com mercado e clientes simulados; Zuni do jogo não é a API de IA do site principal.
