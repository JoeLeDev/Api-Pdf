import { Router } from 'express';
import { generatePdf, getPdfHistory, deletePdf } from './controllers';

const router = Router();

router.post('/generate', generatePdf);
router.get('/history', getPdfHistory);
router.delete('/:id', deletePdf);

export default router;
