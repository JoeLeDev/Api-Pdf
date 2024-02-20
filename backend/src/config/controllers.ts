import { Request, Response } from 'express';
import { bdd } from './bdd';
import { generatePdfFile } from './pdfmodel';

// Type pour les callbacks de SQLite
interface SqliteCallbackThis {
  lastID?: number;
  changes?: number;
}

    export const generatePdf = async (req: Request, res: Response): Promise<void> => {
        const { type, name, surname } = req.body;
    
        try {
            const filePath = await generatePdfFile(type, name, surname);
            
            // Insère les détails du PDF dans la base de données
            bdd.run('INSERT INTO pdfs (type, name, surname, fileName) VALUES (?, ?, ?, ?)', [type, name, surname, filePath], function(this: SqliteCallbackThis, err: Error | null) {
                if (err) {
                    console.error("Erreur lors de l'enregistrement des détails du PDF", err);
                    if (!res.headersSent) {
                        res.status(500).json({ message: "Erreur lors de l'enregistrement des détails du PDF" });
                    }
                    return;
                }
                // Envoie le fichier PDF au client sans spécifier Content-Type explicitement
                res.download(filePath, 'document.pdf', (err) => {
                    if (err && !res.headersSent) {
                        console.error("Erreur lors de l'envoi du fichier PDF", err);
                        res.status(500).send("Erreur lors de l'envoi du fichier PDF");
                    }
                   
                });
            });
        } catch (error) {
            console.error("Erreur lors de la génération du PDF: ", error);
            if (!res.headersSent) {
                res.status(500).json({ message: "Erreur lors de la génération du PDF" });
            }
        }
    };
    
  export const getPdfHistory = (req: Request, res: Response): void => {
    bdd.all('SELECT * FROM pdfs ORDER BY createdAt DESC', [], (err: Error | null, rows: Array<any>) => {
        if (err) {
            console.error("Erreur lors de la récupération de l'historique des PDFs", err);
            res.status(500).send("Erreur lors de la récupération de l'historique des PDFs");
            return;
        }
        res.json(rows);
    });
};

export const deletePdf = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
  
    try {
        const result = await new Promise<number>((resolve, reject) => {
            bdd.run('DELETE FROM pdfs WHERE id = ?', [id], function(this: { changes: number }, err: Error | null) {
              if (err) {
                reject(err);
              } else {
                resolve(this.changes); // Résout avec le nombre de lignes changées, qui est de type number
              }
            });
          });
  
      if (result > 0) {
        res.send({ message: "Entrée PDF supprimée avec succès" });
      } else {
        res.status(404).send({ message: "Entrée PDF non trouvée" });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'entrée PDF", error);
      res.status(500).send("Erreur lors de la suppression de l'entrée PDF");
    }

}