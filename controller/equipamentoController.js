import { Equipamento } from '../model/Equipamento.js';
import {
  atualizarEquipamento,
  buscarEquipamentoPorId,
  criarEquipamento,
  excluirEquipamento,
  listarEquipamentos
} from '../repository/equipamentoRepository.js';
import { criarCrudController } from './criarCrudController.js';

export const equipamentoController = criarCrudController({
  entidade: 'Equipamento',
  Model: Equipamento,
  campos: ['nome', 'patrimonio', 'situacao'],
  listar: listarEquipamentos,
  buscarPorId: buscarEquipamentoPorId,
  criar: criarEquipamento,
  atualizar: atualizarEquipamento,
  excluir: excluirEquipamento
});
