import { conexao } from '../database/conexao.js';

export async function listarEnsaios() {
  const [linhas] = await conexao.execute('SELECT id_ensaio, nome, norma, status FROM ensaio ORDER BY id_ensaio');
  return linhas;
}

export async function buscarEnsaioPorId(id) {
  const [linhas] = await conexao.execute(
    'SELECT id_ensaio, nome, norma, status FROM ensaio WHERE id_ensaio = ?',
    [id]
  );
  return linhas[0] ?? null;
}

export async function criarEnsaio({ nome, norma, status }) {
  const [resultado] = await conexao.execute(
    'INSERT INTO ensaio (nome, norma, status) VALUES (?, ?, ?)',
    [nome, norma, status]
  );
  return buscarEnsaioPorId(resultado.insertId);
}

export async function atualizarEnsaio(id, campos) {
  const colunas = { nome: 'nome', norma: 'norma', status: 'status' };
  const atribuicoes = Object.keys(campos).map((campo) => `${colunas[campo]} = ?`);
  const valores = Object.keys(campos).map((campo) => campos[campo]);
  await conexao.execute(
    `UPDATE ensaio SET ${atribuicoes.join(', ')} WHERE id_ensaio = ?`,
    [...valores, id]
  );
}

export async function excluirEnsaio(id) {
  const [resultado] = await conexao.execute('DELETE FROM ensaio WHERE id_ensaio = ?', [id]);
  return resultado.affectedRows > 0;
}
