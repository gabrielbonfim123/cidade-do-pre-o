# ZUZ — Cidade do Preço 🎮

Jogo educativo de empreendedorismo e precificação do projeto ZUZ, desenvolvido em HTML, CSS e JavaScript.

## Jogar no VS Code

1. Instale Node.js atualizado.
2. Abra a pasta `cidade-do-preco`.
3. Execute:

```bash
npm install
npm run dev
```

4. Abra o endereço exibido pelo Vite, normalmente `http://127.0.0.1:5173/`.

## Novidades: loja interativa

- **Interior da loja:** clique na vitrine, no balcão, na cozinha, no estoque, na decoração, no caixa e na porta.
- **Clientes com personalidade:** seis personagens fictícios com preferências, diálogos e satisfação.
- **Decoração:** reorganize móveis gratuitamente e compre melhorias permanentes.
- **Tutorial ampliado:** mais etapas guiadas e seis missões práticas.
- **Dia rápido:** `Encerrar expediente` permite fazer o balanço sem completar todas as tarefas opcionais. Se faltar estoque, o jogo tenta repor automaticamente ou ajustar a produção ao dinheiro disponível.
- **Próximo dia:** continue diretamente após o resultado.
- **Responsivo:** controles adaptados ao celular.

## Mecânicas preservadas

O jogo mantém cadastro de novos produtos, preços, produção, mercado fictício, fornecedores, ingredientes, funcionários, eventos, missões, segunda unidade, relatórios, histórico e salvamento local.

**Importante:** os minijogos e atendimentos influenciam a demanda, mas somente o fechamento contabiliza as vendas e despesas. Ingredientes não são cobrados duas vezes.

## Publicação na Vercel

Importe o repositório com preset **Vite**, diretório raiz `./`, comando `npm run build` e diretório de saída `dist`. A configuração `vite.config.js` mantém os scripts, ícones, estilos e arquivos offline no build.

O projeto pode rodar sem frameworks de interface complexos. Os dados econômicos são simulados para fins educacionais.
