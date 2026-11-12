# API de Laboratório de Ensaios

API REST para manter os ensaios, equipamentos e analistas de um laboratório industrial. Cada recurso possui validação na Model, acesso ao MySQL no Repository e rotas próprias.

## Tecnologias

- JavaScript com módulos ES (ESM) e Node.js
- Express
- MySQL e `mysql2/promise`
- Postman para testar as requisições
- Git e GitHub para controle de versão

## Requisitos

- Node.js 20 ou superior
- MySQL 8 ou superior
- Postman (opcional para importar a coleção; os testes de integração também podem ser executados pelo npm)

## Instalação e configuração

1. Clone o repositório e instale as dependências:

   ```bash
   git clone https://github.com/047gabriel/API-de-Laborat-rio-de-Ensaios.git
   cd API-de-Laborat-rio-de-Ensaios
   npm install
   ```

2. Crie o banco e as tabelas. No terminal do MySQL:

   ```sql
   SOURCE C:/caminho/para/API-de-Laborat-rio-de-Ensaios/banco.sql;
   ```

   O script cria o banco `laboratorio_ensaios` e as tabelas `ensaio`, `equipamento` e `analista`, sem chaves estrangeiras.

3. Crie o arquivo local `.env` a partir do exemplo e ajuste os dados da sua instalação. No PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   Configure `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` e `PORT`. O `.env` é ignorado pelo Git; compartilhe apenas o `.env.example`, sem credenciais reais.

4. Inicie a API:

   ```bash
   npm start
   ```

   Em desenvolvimento, `npm run dev` reinicia o servidor quando os arquivos mudam. Por padrão, a API fica em `http://localhost:3000`.

## Rotas

Todas as rotas recebem e retornam JSON. Para operações de escrita, envie `Content-Type: application/json`.

| Método | Rota | Ação | Respostas esperadas |
|---|---|---|---|
| POST | `/ensaio` | Cadastrar ensaio | 201, 400 |
| GET | `/ensaio` | Listar ensaios | 200 |
| GET | `/ensaio/:id` | Buscar ensaio | 200, 400, 404 |
| PATCH | `/ensaio/:id` | Atualizar campos enviados | 200, 400, 404 |
| DELETE | `/ensaio/:id` | Excluir ensaio | 200, 400, 404 |
| POST | `/equipamento` | Cadastrar equipamento | 201, 400 |
| GET | `/equipamento` | Listar equipamentos | 200 |
| GET | `/equipamento/:id` | Buscar equipamento | 200, 400, 404 |
| PATCH | `/equipamento/:id` | Atualizar campos enviados | 200, 400, 404 |
| DELETE | `/equipamento/:id` | Excluir equipamento | 200, 400, 404 |
| POST | `/analista` | Cadastrar analista | 201, 400 |
| GET | `/analista` | Listar analistas | 200 |
| GET | `/analista/:id` | Buscar analista | 200, 400, 404 |
| PATCH | `/analista/:id` | Atualizar campos enviados | 200, 400, 404 |
| DELETE | `/analista/:id` | Excluir analista | 200, 400, 404 |

### Exemplos de cadastro

`POST /ensaio`

```json
{
  "nome": "Ensaio de dureza",
  "norma": "ISO 6508",
  "status": "Ativo"
}
```

`POST /equipamento`

```json
{
  "nome": "Durômetro",
  "patrimonio": "PAT-001",
  "situacao": "Disponível"
}
```

`POST /analista`

```json
{
  "nome": "Ana Silva",
  "registro": "CRQ-12345",
  "especialidade": "Metalurgia"
}
```

Os nomes precisam ter pelo menos 3 caracteres; os demais campos não podem ficar vazios. IDs devem ser inteiros positivos. `PATCH` aceita um ou mais campos válidos e preserva os não enviados. Erros de validação retornam `400`, registros inexistentes retornam `404` e falhas inesperadas retornam `500`.

## Postman

Importe [`docs/postman/API-Laboratorio.postman_collection.json`](./docs/postman/API-Laboratorio.postman_collection.json) no Postman. A coleção contém uma requisição para cada uma das 15 rotas; use a variável `baseUrl` (por padrão `http://localhost:3000`) e execute cada pasta de recursos na ordem apresentada para cadastrar os IDs usados nas chamadas seguintes. As requisições de exclusão removem os registros criados.

## Testes e evidências

Os testes das Models e da validação de IDs não precisam de banco:

```bash
npm test
```

Para executar os fluxos HTTP completos, configure o banco, inicie o schema com `banco.sql` e rode:

```bash
npm run test:api
```

O teste de integração inicia a aplicação em uma porta local temporária, cadastra três registros de cada recurso, lista, busca, faz `PATCH` parcial, rejeita dados inválidos, valida IDs e respostas `404`, exclui os registros e limpa os dados que criou. A execução salva os resultados HTTP em [`docs/testes/api-evidencias.json`](./docs/testes/api-evidencias.json). Esse arquivo é gerado pela execução real; não há resultados pré-preenchidos. Guarde também nessa pasta as capturas de tela do Postman/Insomnia/Thunder Client, se forem exigidas como evidência visual.

## Estrutura

```text
controller/   Controladores HTTP e fábrica CRUD compartilhada
database/    Pool de conexão MySQL
docs/        Coleção Postman e evidências
model/       Modelos e validações
repository/  Consultas SQL parametrizadas
routes/      Rotas Express por recurso
testes/      Testes de validação e integração HTTP
app.js       Configuração e inicialização do Express
banco.sql    Criação do banco e das tabelas
```
