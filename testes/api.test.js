import assert from 'node:assert/strict';
import { once } from 'node:events';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import test, { after, before } from 'node:test';
import { app } from '../app.js';
import { conexao } from '../database/conexao.js';

let servidor;
let baseUrl;
const evidencias = [];
let execucaoConcluida = false;

before(async () => {
  servidor = app.listen(0);
  await once(servidor, 'listening');
  baseUrl = `http://127.0.0.1:${servidor.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    servidor.close((erro) => erro ? reject(erro) : resolve());
  });
  await conexao.end();
});

async function chamar(metodo, caminho, corpo, statusEsperado) {
  const opcoes = { method: metodo, headers: { 'Content-Type': 'application/json' } };
  if (corpo !== undefined) {
    opcoes.body = JSON.stringify(corpo);
  }

  let resposta;
  try {
    resposta = await fetch(`${baseUrl}${caminho}`, opcoes);
    const texto = await resposta.text();
    const dados = texto ? JSON.parse(texto) : null;
    evidencias.push({
      method: metodo,
      path: caminho,
      expectedStatus: statusEsperado,
      actualStatus: resposta.status,
      passed: resposta.status === statusEsperado,
      response: dados
    });
    assert.equal(resposta.status, statusEsperado, `${metodo} ${caminho}: ${JSON.stringify(dados)}`);
    return dados;
  } catch (erro) {
    if (!resposta) {
      evidencias.push({
        method: metodo,
        path: caminho,
        expectedStatus: statusEsperado,
        passed: false,
        error: erro.message
      });
    }
    throw erro;
  }
}

const recursos = [
  {
    caminho: '/ensaio',
    id: 'id_ensaio',
    criar: (sufixo) => ({ nome: `Ensaio ${sufixo}`, norma: 'ISO 6508', status: 'Ativo' }),
    invalido: { nome: 'AB', norma: 'ISO 6508', status: 'Ativo' },
    atualizacao: { status: 'Em revisão' },
    campoPreservado: 'norma'
  },
  {
    caminho: '/equipamento',
    id: 'id_equipamento',
    criar: (sufixo) => ({ nome: `Equipamento ${sufixo}`, patrimonio: `PAT-${sufixo}`, situacao: 'Disponível' }),
    invalido: { nome: 'AB', patrimonio: 'PAT-INV', situacao: 'Disponível' },
    atualizacao: { situacao: 'Em manutenção' },
    campoPreservado: 'patrimonio'
  },
  {
    caminho: '/analista',
    id: 'id_analista',
    criar: (sufixo) => ({ nome: `Analista ${sufixo}`, registro: `CRQ-${sufixo}`, especialidade: 'Metalurgia' }),
    invalido: { nome: 'AB', registro: 'CRQ-INV', especialidade: 'Metalurgia' },
    atualizacao: { especialidade: 'Química analítica' },
    campoPreservado: 'registro'
  }
];

test('executa os fluxos CRUD, validações e gera evidências HTTP', async () => {
  const sufixo = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const pendentes = new Map();
  let erroLimpeza;

  try {
    for (const recurso of recursos) {
      const ids = [];

      for (let indice = 1; indice <= 3; indice += 1) {
        const resultado = await chamar('POST', recurso.caminho, recurso.criar(`${sufixo}-${indice}`), 201);
        const registro = resultado.data;
        assert.ok(registro[recurso.id] > 0);
        ids.push(registro[recurso.id]);
        pendentes.set(`${recurso.caminho}/${registro[recurso.id]}`, true);
      }

      const listagem = await chamar('GET', recurso.caminho, undefined, 200);
      assert.ok(ids.every((id) => listagem.data.some((registro) => registro[recurso.id] === id)));

      const registro = await chamar('GET', `${recurso.caminho}/${ids[0]}`, undefined, 200);
      const originalPreservado = registro.data[recurso.campoPreservado];

      const atualizacao = await chamar('PATCH', `${recurso.caminho}/${ids[0]}`, recurso.atualizacao, 200);
      assert.equal(atualizacao.data[recurso.campoPreservado], originalPreservado);

      await chamar('POST', recurso.caminho, recurso.invalido, 400);
      await chamar('GET', `${recurso.caminho}/id-invalido`, undefined, 400);
      await chamar('PATCH', `${recurso.caminho}/id-invalido`, recurso.atualizacao, 400);
      await chamar('DELETE', `${recurso.caminho}/id-invalido`, undefined, 400);

      const excluido = await chamar('DELETE', `${recurso.caminho}/${ids[2]}`, undefined, 200);
      assert.equal(excluido.data[recurso.id], ids[2]);
      pendentes.delete(`${recurso.caminho}/${ids[2]}`);
      await chamar('GET', `${recurso.caminho}/${ids[2]}`, undefined, 404);
      await chamar('PATCH', `${recurso.caminho}/${ids[2]}`, recurso.atualizacao, 404);
      await chamar('DELETE', `${recurso.caminho}/${ids[2]}`, undefined, 404);
    }

    execucaoConcluida = true;
  } finally {
    for (const caminho of pendentes.keys()) {
      try {
        await chamar('DELETE', caminho, undefined, 200);
      } catch (erro) {
        erroLimpeza ??= erro;
      }
    }

    const caminhoEvidencia = fileURLToPath(new URL('../docs/testes/api-evidencias.json', import.meta.url));
    await writeFile(caminhoEvidencia, `${JSON.stringify({
      completed: execucaoConcluida && !erroLimpeza,
      generatedAt: new Date().toISOString(),
      baseUrl,
      requestCount: evidencias.length,
      requests: evidencias
    }, null, 2)}\n`);

    if (execucaoConcluida && erroLimpeza) {
      throw new Error(`Falha ao limpar os registros de teste: ${erroLimpeza.message}`);
    }
  }
});
