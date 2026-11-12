import { Router } from 'express';
import { equipamentoController } from '../controller/equipamentoController.js';

const router = Router();

router.post('/', equipamentoController.criar);
router.get('/', equipamentoController.listar);
router.get('/:id', equipamentoController.buscar);
router.patch('/:id', equipamentoController.atualizar);
router.delete('/:id', equipamentoController.excluir);

export default router;
