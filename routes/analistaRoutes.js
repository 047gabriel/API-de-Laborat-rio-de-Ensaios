import { Router } from 'express';
import { analistaController } from '../controller/analistaController.js';

const router = Router();

router.post('/', analistaController.criar);
router.get('/', analistaController.listar);
router.get('/:id', analistaController.buscar);
router.patch('/:id', analistaController.atualizar);
router.delete('/:id', analistaController.excluir);

export default router;
