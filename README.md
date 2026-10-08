# Parking FAG — Interface

React 19.3, TypeScript 5.9, Vite 8.3. Interface em português baseada no protótipo, com mapa físico, painel de setores,
estados textuais e cores verde/vermelho/cinza, acessibilidade, contagens e percentual sobre vagas de estado conhecido.
Consome exclusivamente Java. Não contém estados de vagas fictícios no fluxo de produção.

## Execução local

Node.js 24 e npm. Validação local em Node 24.16 e npm 11.13.

```sh
npm ci
npm run dev
```

Abra [localhost:5173](http://localhost:5173). A aplicação fica disponível também pelo IP da máquina na rede local, na porta 5173.
O endpoint web [localhost:5173/painel](http://localhost:5173/painel) apresenta somente o painel de vagas e sua legenda, sem o restante do site.
Ambas as páginas usam a mesma API, atualização periódica e preservação de dados em falhas. Em hospedagem de `dist`, configure fallback das rotas para `index.html`.
O proxy `/api` encaminha ao Java em `localhost:8080`, evitando exigir a URL localhost do computador servidor nos navegadores de outras máquinas.
Copie `.env.example` para `.env` para personalizar o proxy. Reinicie Vite ao alterar variáveis.

Para uma API em origem separada, defina `VITE_API_BASE_URL` e habilite a origem do frontend em `CORS_ORIGINS` no Java.
Nunca coloque chave de ingestão ou credencial de banco em variáveis `VITE_*`.

## Atualização e falhas

Consulta inicial imediata. Próxima consulta 15 segundos após sucesso ou 30 após falha, com timeout de 8 segundos.
Não há consultas sobrepostas. Desmontar a interface cancela a consulta pendente.
Durante indisponibilidade, os últimos estados e horário bem-sucedido permanecem. O snapshot também é mantido no navegador para recarregamentos.
Não apresenta mensagens de erro técnico, conforme pedido do usuário. Indica discretamente "Última leitura disponível".
Sem observações anteriores, apresenta "Aguardando monitoramento". Catálogo vazio é tratado separadamente.
Estado `UNKNOWN` vem do Java; falha HTTP não muda estados para desconhecidos.

## Qualidade e build

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

`preview` permite conferir o build local e possui o mesmo proxy. Para implantação permanente, sirva `dist` e configure proxy `/api` ou API de origem separada.
GitHub Actions executa instalação pelo lockfile, lint, tipagem, testes e build em Node 24.
Vitest/React Testing Library verificam apresentação, atualização, retry, cancelamento, retenção de cache e catálogo vazio.
Mocks são exclusivos dos testes.

[Contrato compartilhado](docs/API.md) · [Validação](docs/VALIDATION.md)
