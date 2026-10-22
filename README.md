# ZUZ — Cidade do Preço · Ciclo Vivo V3

**Atualização do jogo original**, com o mesmo sistema de precificação e sem apagar dados salvos no navegador.

## Novidades

- **Expediente automático:** em **Interior da loja**, clique em **Abrir loja** para iniciar a passagem automática de manhã → tarde → noite. Cada turno dura 30 segundos (dia completo de 90 segundos). Com **2× velocidade**, o dia passa em cerca de 45 segundos. É possível pausar e retomar.
- **Clientes ao longo do dia:** clientes diferentes entram no estabelecimento ao longo do dia; a tarde tem movimento mais intenso. A fila mostra até cinco clientes. Clique no personagem ou em **Atender próximo cliente** para conversar e entregar o produto certo.
- **Atendimento dos funcionários:** qualquer funcionário contratado atende a fila automaticamente, com velocidades diferentes: atendente a cada 3 segundos, gerente a cada 5 e cozinheiro a cada 7. Se houver mais de um, prevalece o mais rápido. O valor de cada atendimento **não é somado separadamente**: a receita permanece na simulação financeira de fechamento.
- **Fechamento automático:** ao acabar o turno da noite, o jogo tenta fechar o caixa, repondo insumos ou ajustando a produção ao orçamento, como no botão de fechamento rápido. O botão **Encerrar expediente** segue disponível a qualquer momento.
- **Loja redesenhada:** vitrine, cozinha, balcão, caixa, decoração, entrada, iluminação, fila de personagens e painel de atendimento mais legíveis, em desktop e celular.
- **Salvamento:** relógio, filas, progresso, funcionários e valores permanecem no armazenamento local. O relógio pausa ao sair ou recarregar e pode ser retomado. A animação pausa durante diálogos e o tutorial para não consumir seu tempo de jogo.

## Como executar

```sh
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite (normalmente `http://127.0.0.1:5173/`).
Para publicar na Vercel, framework `Vite`, comando de build `npm run build`, diretório de saída `dist`.

## Notas do jogo

Os visitantes animados representam a experiência de atendimento. O lucro, a receita, os salários e os insumos continuam sendo calculados **uma única vez** ao encerrar o dia em `resultDay()`, com os efeitos já existentes de demanda, preço e reputação. Os números e clientes são simulações educativas.

---

# ZUZ — Cidade do Preço | Edição Loja Interativa

Jogo educativo do TCC ZUZ sobre precificação, gestão de pequenos negócios e empreendedorismo.

## Iniciar no VS Code

**Pré-requisito:** Node.js atualizado (versão 20.19 ou mais recente).

Abra a pasta extraída no VS Code, execute um comando por vez:

```bash
npm install
npm run dev
```

Abra o endereço informado pelo Vite (normalmente `http://127.0.0.1:5173/`).

> Não use o projeto do Simulador de Trabalho para iniciar esta pasta. O `package.json` aqui já está configurado como `zuz-cidade-do-preco`.

## Novidades desta edição

- **Loja interativa:** vitrine, cozinha com um desafio educativo, balcão, caixa, estoque, decoração e porta clicáveis.
- **Personalização:** reorganize a disposição dos móveis gratuitamente e compre plantas, luminárias e mesinha com dinheiro do jogo. Esses investimentos aparecem no histórico.
- **Clientes com personalidade:** seis personagens fictícios com falas, preferências e reações aos preços e ao atendimento. O bônus de satisfação influencia a procura sem registrar vendas repetidas.
- **Tutorial ampliado:** tutorial guiado com mais etapas e seis missões práticas, com progresso salvo no dispositivo.
- **Fechamento rápido:** botão “Encerrar expediente” no topo, no interior da loja e em Vendas e clientes. Reposição automática se houver caixa, ou ajuste da produção ao orçamento. O botão “Próximo dia” permite avançar diretamente após o balanço.
- **Versão mobile:** a loja tem botões adaptados a toque e mantém o menu próprio para celulares.

## O que não mudou

Os sistemas de produtos próprios, preços, custos, estoque de insumos, equipe, segunda unidade, eventos, bairro, compras, melhorias, relatórios e histórico continuam integrados. Os dados antigos usam a **mesma chave de salvamento local**, e os novos campos recebem valores padrão automaticamente.

Os atendimentos interativos simulam a experiência e influenciam a demanda; **somente o encerramento do dia registra o resultado definitivo**. As compras de ingredientes são descontadas uma vez do caixa.

## Publicar na Vercel

A configuração `vite.config.js` copia para `dist/` os scripts clássicos, imagens, música, manifest e arquivos exigidos pelo service worker. No painel da Vercel, importe o repositório GitHub com preset **Vite**, diretório raiz **./**, comando **npm run build** e pasta de saída **dist**.

Para subir este ZIP substituindo o seu projeto local, **faça backup antes**, extraia os arquivos sobre a pasta do Cidade do Preço, abra o terminal na mesma pasta e execute:

```bash
npm install
npm run dev
```

Após conferir localmente:

```bash
git add .
git commit -m "Loja interativa, clientes e fechamento rapido"
git push origin main
```

Se for um clone existente e houver mudanças no GitHub, execute `git pull origin main` **antes** de copiar os novos arquivos, ou revise os conflitos manualmente. O ZIP não inclui `node_modules` nem `dist`.
