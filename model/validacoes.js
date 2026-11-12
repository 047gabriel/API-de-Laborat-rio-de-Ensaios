export function validarCamposObrigatorios(dados, campos) {
  const erros = [];

  for (const [campo, rotulo, minimo] of campos) {
    const valor = dados[campo];
    if (typeof valor !== 'string' || valor.trim().length < minimo) {
      erros.push(`${rotulo} deve conter ${minimo === 1 ? 'ao menos 1 caractere' : `ao menos ${minimo} caracteres`}.`);
    }
  }

  return erros;
}

export function validarIdPositivo(id) {
  if (typeof id === 'number') {
    return Number.isSafeInteger(id) && id > 0;
  }

  if (typeof id !== 'string' || !/^\d+$/.test(id)) {
    return false;
  }

  const numero = Number(id);
  return Number.isSafeInteger(numero) && numero > 0;
}

export function obterCamposDesconhecidos(dados, camposPermitidos) {
  return Object.keys(dados).filter((campo) => !camposPermitidos.includes(campo));
}
