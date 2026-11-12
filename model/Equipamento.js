import { validarCamposObrigatorios } from './validacoes.js';

export class Equipamento {
  constructor({ nome, patrimonio, situacao } = {}) {
    this.nome = nome;
    this.patrimonio = patrimonio;
    this.situacao = situacao;
  }

  validar() {
    return validarCamposObrigatorios(this, [
      ['nome', 'Nome', 3],
      ['patrimonio', 'Patrimônio', 1],
      ['situacao', 'Situação', 1]
    ]);
  }
}
