# Evidências de testes

Execute `npm run test:api` com o MySQL configurado e o schema de `banco.sql` aplicado. O teste HTTP exercita as rotas dos três recursos, cria três registros por recurso, valida o `PATCH` parcial, rejeita dados inválidos, verifica IDs inválidos e registros inexistentes, e exclui/limpa os registros criados.

A execução grava [`api-evidencias.json`](./api-evidencias.json) com horário, caminho, método, status esperado, status recebido e corpo da resposta. O arquivo só é produzido por uma execução real do teste. Para evidência visual, exporte ou capture também o resultado da execução da coleção Postman e salve as imagens nesta pasta.
