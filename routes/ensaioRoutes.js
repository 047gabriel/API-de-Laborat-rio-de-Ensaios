import { Router } from 'express';
import { ensaioController } from '../controller/ensaioController.js';

const router = Router();

router.post('/', ensaioController.criar);
router.get('/', ensaioController.listar);
router.get('/:id', ensaioController.buscar);
router.patch('/:id', ensaioController.atualizar);
router.delete('/:id', ensaioController.excluir);

export default router;
