import { conexao } from '../database/conexao.js';

export async function listarEquipamentos() {
  const [linhas] = await conexao.execute(
    'SELECT id_equipamento, nome, patrimonio, situacao FROM equipamento ORDER BY id_equipamento'
  );
  return linhas;
}

export async function buscarEquipamentoPorId(id) {
  const [linhas] = await conexao.execute(
    'SELECT id_equipamento, nome, patrimonio, situacao FROM equipamento WHERE id_equipamento = ?',
    [id]
  );
  return linhas[0] ?? null;
}

export async function criarEquipamento({ nome, patrimonio, situacao }) {
  const [resultado] = await conexao.execute(
    'INSERT INTO equipamento (nome, patrimonio, situacao) VALUES (?, ?, ?)',
    [nome, patrimonio, situacao]
  );
  return buscarEquipamentoPorId(resultado.insertId);
}

export async function atualizarEquipamento(id, campos) {
  const colunas = { nome: 'nome', patrimonio: 'patrimonio', situacao: 'situacao' };
  const atribuicoes = Object.keys(campos).map((campo) => `${colunas[campo]} = ?`);
  const valores = Object.keys(campos).map((campo) => campos[campo]);
  await conexao.execute(
    `UPDATE equipamento SET ${atribuicoes.join(', ')} WHERE id_equipamento = ?`,
    [...valores, id]
  );
}

export async function excluirEquipamento(id) {
  const [resultado] = await conexao.execute('DELETE FROM equipamento WHERE id_equipamento = ?', [id]);
  return resultado.affectedRows > 0;
}
