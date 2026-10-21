# Publicar o ZUZ — passo a passo

**Conta GitHub:** `gabrielbonfim123` (conectada ao ChatGPT na preparação deste pacote).

O repositório **ainda precisa ser criado no GitHub**. A integração do ChatGPT disponível nesta conversa permite editar repositórios existentes, mas não possui a ação de criar um repositório novo.

## 1. Criar repositório

1. Abra <https://github.com/new> com sua conta.
2. Em **Repository name**, digite `zuz-cidade-do-preco`.
3. Marque **Public**.
4. Não marque README, .gitignore ou licença, pois o projeto já tem seus arquivos.
5. Clique em **Create repository**.

## 2. Enviar todos os arquivos pelo VS Code (Windows)

1. Extraia o ZIP e abra a pasta **ZUZ_Cidade_do_Preco_Mobile** no VS Code.
2. No terminal integrado, execute:

```bash
git init -b main
git add .
git commit -m "ZUZ Cidade do Preço - tutorial e versão mobile"
git remote add origin https://github.com/gabrielbonfim123/zuz-cidade-do-preco.git
git push -u origin main
```

Se o Git pedir autenticação, siga a janela do GitHub no navegador. Se `git init -b main` não funcionar, use `git init` e depois `git branch -M main`. Estes comandos só funcionam depois de criar o repositório vazio.

## 3. Ativar o site para todo mundo

1. Entre no repositório, abra **Settings** → **Pages**.
2. Em **Build and deployment**, selecione **GitHub Actions**.
3. Abra **Actions** e confira o workflow **Publicar ZUZ no GitHub Pages**. Se necessário, clique **Run workflow**.
4. Aguarde o sinal verde do deploy.
5. Confira o endereço indicado no painel Pages. Em uma configuração padrão de repositório público, ele deve ter formato `https://gabrielbonfim123.github.io/zuz-cidade-do-preco/` — **essa URL só funciona depois que o deploy terminar**.

## 4. Jogar no celular

- **Android**: abra a URL no Chrome, menu ⋮, **Instalar aplicativo** / **Adicionar à tela inicial**.
- **iPhone**: abra a URL no Safari, Compartilhar, **Adicionar à Tela de Início**.
- A primeira visita exige internet; depois o cache oferece funcionamento offline no mesmo dispositivo. O navegador pode exigir um primeiro toque para reproduzir a música.
- Os dados do jogo são salvos localmente; o progresso não é sincronizado entre celular e PC.

## 5. Tutorial no jogo

Clique em **Começar desafio**. A navegação guiada tem 18 etapas. Use **Próximo**, **Voltar**, **Testar tela** e **Retomar tutorial**. Para começar novamente, vá à aba **Como jogar**, acessível em **Mais** no menu inferior do celular.
