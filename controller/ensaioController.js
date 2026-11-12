import { Ensaio } from '../model/Ensaio.js';
import {
  atualizarEnsaio,
  buscarEnsaioPorId,
  criarEnsaio,
  excluirEnsaio,
  listarEnsaios
} from '../repository/ensaioRepository.js';
import { criarCrudController } from './criarCrudController.js';

export const ensaioController = criarCrudController({
  entidade: 'Ensaio',
  Model: Ensaio,
  campos: ['nome', 'norma', 'status'],
  listar: listarEnsaios,
  buscarPorId: buscarEnsaioPorId,
  criar: criarEnsaio,
  atualizar: atualizarEnsaio,
  excluir: excluirEnsaio
});
