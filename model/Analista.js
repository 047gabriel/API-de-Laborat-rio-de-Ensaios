import { validarCamposObrigatorios } from './validacoes.js';

export class Analista {
  constructor({ nome, registro, especialidade } = {}) {
    this.nome = nome;
    this.registro = registro;
    this.especialidade = especialidade;
  }

  validar() {
    return validarCamposObrigatorios(this, [
      ['nome', 'Nome', 3],
      ['registro', 'Registro', 1],
      ['especialidade', 'Especialidade', 1]
    ]);
  }
}
