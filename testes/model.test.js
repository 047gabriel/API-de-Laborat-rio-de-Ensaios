import assert from 'node:assert/strict';
import test from 'node:test';
import { Analista } from '../model/Analista.js';
import { Ensaio } from '../model/Ensaio.js';
import { Equipamento } from '../model/Equipamento.js';
import { validarIdPositivo } from '../model/validacoes.js';

test('Ensaio aceita dados válidos e rejeita nome curto e campos vazios', () => {
  assert.deepEqual(new Ensaio({ nome: 'Dureza', norma: 'ISO 6508', status: 'Ativo' }).validar(), []);
  assert.equal(new Ensaio({ nome: 'AB', norma: ' ', status: '' }).validar().length, 3);
});

test('Equipamento aceita dados válidos e rejeita nome curto e campos vazios', () => {
  assert.deepEqual(
    new Equipamento({ nome: 'Durômetro', patrimonio: 'PAT-001', situacao: 'Disponível' }).validar(),
    []
  );
  assert.equal(new Equipamento({ nome: 'AB', patrimonio: '', situacao: ' ' }).validar().length, 3);
});

test('Analista aceita dados válidos e rejeita nome curto e campos vazios', () => {
  assert.deepEqual(
    new Analista({ nome: 'Ana Silva', registro: 'CRQ-001', especialidade: 'Metalurgia' }).validar(),
    []
  );
  assert.equal(new Analista({ nome: 'AB', registro: '', especialidade: ' ' }).validar().length, 3);
});

test('ID aceita apenas inteiros positivos seguros', () => {
  for (const id of [1, 25, '1', '250', '0001']) {
    assert.equal(validarIdPositivo(id), true);
  }
  for (const id of [0, -1, 1.5, '0', '-2', '1.5', '1abc', '', '9007199254740992', null]) {
    assert.equal(validarIdPositivo(id), false);
  }
});
