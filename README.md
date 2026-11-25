# Botânica Flores — e-commerce demonstrativo para teste

Projeto de front-end em HTML5, CSS3 e JavaScript puro, sem dependências externas, servidor ou banco de dados.

## Como abrir no VS Code

1. Extraia o ZIP em uma pasta.
2. Abra o VS Code e selecione Arquivo > Abrir Pasta. Escolha a pasta `botanica-flores`.
3. Abra `index.html` diretamente no navegador ou use a extensão opcional Live Server (clique direito em `index.html` > Open with Live Server).

## Funcionalidades

- Home: catálogo com 10 produtos, busca, filtros e carrinho demonstrativo.
- Login e cadastro: validação básica de formulários e mensagens de simulação.
- Estoque: consulta de quantidades fictícias, busca e atualização na sessão ao simular pedidos.
- Pedidos: exemplos de acompanhamento e novos pedidos simulados pelo carrinho.
- Entrega nacional: simulação de frete e prazo com dados ilustrativos.
- Exportação: formulário demonstrativo de cotação internacional.

## Estrutura

- `index.html`: conteúdo, abas e formulários.
- `style.css`: identidade visual e responsividade.
- `script.js`: navegação, catálogo, carrinho e interações simuladas.
- `assets/`: ilustrações vetoriais locais e `logo.jpg` (logotipo original fornecido).

Nenhum dado é enviado ou armazenado permanentemente. Utilize somente dados fictícios. O carrinho, estoque e pedidos voltam ao estado inicial ao recarregar a página. Os preços, estoques, prazos e informações comerciais são apenas exemplos. Não há integração de pagamento, autenticação real, API ou logística real.

## Identidade visual

- Vinho: `#801414`
- Vermelho: `#9C2A2A`
- Bege: `#FAF4EA`

As ilustrações e a logo original preservam seus tons naturais. A interface prioriza vinho, vermelho e bege; os painéis de entrega nacional e exportação usam vinho e vermelho, respectivamente.

As cores principais estão nas variáveis CSS no início de `style.css`. Tons auxiliares mais escuros e claros garantem contraste e legibilidade.
