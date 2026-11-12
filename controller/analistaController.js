import { Analista } from '../model/Analista.js';
import {
  atualizarAnalista,
  buscarAnalistaPorId,
  criarAnalista,
  excluirAnalista,
  listarAnalistas
} from '../repository/analistaRepository.js';
import { criarCrudController } from './criarCrudController.js';

export const analistaController = criarCrudController({
  entidade: 'Analista',
  Model: Analista,
  campos: ['nome', 'registro', 'especialidade'],
  listar: listarAnalistas,
  buscarPorId: buscarAnalistaPorId,
  criar: criarAnalista,
  atualizar: atualizarAnalista,
  excluir: excluirAnalista
});
