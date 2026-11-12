import { conexao } from '../database/conexao.js';

export async function listarAnalistas() {
  const [linhas] = await conexao.execute(
    'SELECT id_analista, nome, registro, especialidade FROM analista ORDER BY id_analista'
  );
  return linhas;
}

export async function buscarAnalistaPorId(id) {
  const [linhas] = await conexao.execute(
    'SELECT id_analista, nome, registro, especialidade FROM analista WHERE id_analista = ?',
    [id]
  );
  return linhas[0] ?? null;
}

export async function criarAnalista({ nome, registro, especialidade }) {
  const [resultado] = await conexao.execute(
    'INSERT INTO analista (nome, registro, especialidade) VALUES (?, ?, ?)',
    [nome, registro, especialidade]
  );
  return buscarAnalistaPorId(resultado.insertId);
}

export async function atualizarAnalista(id, campos) {
  const colunas = { nome: 'nome', registro: 'registro', especialidade: 'especialidade' };
  const atribuicoes = Object.keys(campos).map((campo) => `${colunas[campo]} = ?`);
  const valores = Object.keys(campos).map((campo) => campos[campo]);
  await conexao.execute(
    `UPDATE analista SET ${atribuicoes.join(', ')} WHERE id_analista = ?`,
    [...valores, id]
  );
}

export async function excluirAnalista(id) {
  const [resultado] = await conexao.execute('DELETE FROM analista WHERE id_analista = ?', [id]);
  return resultado.affectedRows > 0;
}
