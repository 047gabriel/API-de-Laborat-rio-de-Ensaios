import { validarCamposObrigatorios } from './validacoes.js';

export class Ensaio {
  constructor({ nome, norma, status } = {}) {
    this.nome = nome;
    this.norma = norma;
    this.status = status;
  }

  validar() {
    return validarCamposObrigatorios(this, [
      ['nome', 'Nome', 3],
      ['norma', 'Norma', 1],
      ['status', 'Status', 1]
    ]);
  }
}
