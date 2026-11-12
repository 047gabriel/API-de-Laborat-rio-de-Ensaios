import { obterCamposDesconhecidos, validarIdPositivo } from '../model/validacoes.js';

function corpoValido(corpo) {
  return corpo !== null && typeof corpo === 'object' && !Array.isArray(corpo);
}

function responderErroInterno(res, entidade, operacao, erro) {
  console.error(`Erro ao ${operacao} ${entidade}:`, erro);
  return res.status(500).json({ message: 'Erro inesperado ao acessar o banco de dados.' });
}

export function criarCrudController({
  entidade,
  Model,
  campos,
  listar,
  buscarPorId,
  criar,
  atualizar,
  excluir
}) {
  return {
    listar: async (_req, res) => {
      try {
        const registros = await listar();
        return res.status(200).json({ message: `Registros de ${entidade.toLowerCase()} listados com sucesso.`, data: registros });
      } catch (erro) {
        return responderErroInterno(res, entidade, 'listar', erro);
      }
    },

    buscar: async (req, res) => {
      if (!validarIdPositivo(req.params.id)) {
        return res.status(400).json({ message: 'O ID deve ser um número inteiro positivo.' });
      }

      try {
        const registro = await buscarPorId(Number(req.params.id));
        if (!registro) {
          return res.status(404).json({ message: `${entidade} não encontrado.` });
        }
        return res.status(200).json({ message: `${entidade} encontrado com sucesso.`, data: registro });
      } catch (erro) {
        return responderErroInterno(res, entidade, 'buscar', erro);
      }
    },

    criar: async (req, res) => {
      if (!corpoValido(req.body)) {
        return res.status(400).json({ message: 'Envie um objeto JSON com os dados do recurso.' });
      }

      const camposDesconhecidos = obterCamposDesconhecidos(req.body, campos);
      if (camposDesconhecidos.length > 0) {
        return res.status(400).json({
          message: 'O corpo contém campos não reconhecidos.',
          errors: camposDesconhecidos
        });
      }

      const modelo = new Model(req.body);
      const erros = modelo.validar();
      if (erros.length > 0) {
        return res.status(400).json({ message: 'Dados inválidos.', errors: erros });
      }

      try {
        const registro = await criar(modelo);
        return res.status(201).json({ message: `${entidade} cadastrado com sucesso.`, data: registro });
      } catch (erro) {
        return responderErroInterno(res, entidade, 'cadastrar', erro);
      }
    },

    atualizar: async (req, res) => {
      if (!validarIdPositivo(req.params.id)) {
        return res.status(400).json({ message: 'O ID deve ser um número inteiro positivo.' });
      }
      if (!corpoValido(req.body)) {
        return res.status(400).json({ message: 'Envie um objeto JSON com os campos a atualizar.' });
      }
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Informe ao menos um campo para atualizar.' });
      }

      const camposDesconhecidos = obterCamposDesconhecidos(req.body, campos);
      if (camposDesconhecidos.length > 0) {
        return res.status(400).json({
          message: 'O corpo contém campos não reconhecidos.',
          errors: camposDesconhecidos
        });
      }

      try {
        const id = Number(req.params.id);
        const atual = await buscarPorId(id);
        if (!atual) {
          return res.status(404).json({ message: `${entidade} não encontrado.` });
        }

        const modelo = new Model({ ...atual, ...req.body });
        const erros = modelo.validar();
        if (erros.length > 0) {
          return res.status(400).json({ message: 'Dados inválidos.', errors: erros });
        }

        await atualizar(id, Object.fromEntries(
          campos.filter((campo) => Object.hasOwn(req.body, campo)).map((campo) => [campo, modelo[campo]])
        ));

        const registro = await buscarPorId(id);
        if (!registro) {
          return res.status(404).json({ message: `${entidade} não encontrado.` });
        }
        return res.status(200).json({ message: `${entidade} atualizado com sucesso.`, data: registro });
      } catch (erro) {
        return responderErroInterno(res, entidade, 'atualizar', erro);
      }
    },

    excluir: async (req, res) => {
      if (!validarIdPositivo(req.params.id)) {
        return res.status(400).json({ message: 'O ID deve ser um número inteiro positivo.' });
      }

      try {
        const id = Number(req.params.id);
        const registro = await buscarPorId(id);
        if (!registro) {
          return res.status(404).json({ message: `${entidade} não encontrado.` });
        }

        const removido = await excluir(id);
        if (!removido) {
          return res.status(404).json({ message: `${entidade} não encontrado.` });
        }
        return res.status(200).json({ message: `${entidade} excluído com sucesso.`, data: registro });
      } catch (erro) {
        return responderErroInterno(res, entidade, 'excluir', erro);
      }
    }
  };
}
