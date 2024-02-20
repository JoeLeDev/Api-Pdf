import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generatePdfFile = (type: string, name: string, surname: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const pdfsDir = path.join(__dirname, '..', '..', 'generated-pdfs'); // Chemin vers le dossier qui stocke les pdfs
    const fileName = `output-${type}-${Date.now()}.pdf`; 
    const filePath = path.join(pdfsDir, fileName); // Utilise path.join pour construction le chemin du fichier

    // Vérification que le dossier existe, sinon création de ce dernier
    if (!fs.existsSync(pdfsDir)) {
      fs.mkdirSync(pdfsDir, { recursive: true });
    }

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    stream.on('finish', () => resolve(filePath));
    stream.on('error', (error) => {
      // Supprime le fichier PDF partiel si l'écriture échoue.
      fs.unlink(filePath, (err) => {
        if (err) console.error(`Erreur lors de la suppression du fichier PDF partiel : ${err}`);
      });
      reject(error);
    });
    doc.pipe(stream);
    doc.fontSize(25).text(`Document de type: ${type} de ${name} ${surname}`, 150, 100);
    doc.end();

  });
};
