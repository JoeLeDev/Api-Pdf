const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Chemin absolu vers la base de données
const dbPath = path.resolve(__dirname, 'mydatabase.db');

const bdd = new sqlite3.Database(dbPath, (err: Error | null) => {
  if (err) {
    console.error("Erreur lors de l'ouverture de la base de données", err);
    throw err;
  }
  console.log('Connecté à la base de données SQLite à l\'emplacement', dbPath);
});

bdd.serialize(() => {
  bdd.run(`CREATE TABLE IF NOT EXISTS pdfs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    name TEXT,
    surname TEXT,
    fileName TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );`, (err: Error | null) => {
    if (err) {
      console.error("Erreur lors de la création de la table pdfs", err);
    } else {
      console.log('Table "pdfs" créée ou déjà existante');
    }
  });
});

bdd.serialize(() => {
  // Ajoute la colonne 'name' à la table 'pdfs'
  bdd.run("ALTER TABLE pdfs ADD COLUMN name TEXT;", (err: Error) => {
    if (err) {
      console.error("Erreur lors de l'ajout de la colonne 'name'", err);
    } else {
      console.log("Colonne 'name' ajoutée avec succès.");
    }
  });

  // Ajoute la colonne 'surname' à la table 'pdfs'
  bdd.run("ALTER TABLE pdfs ADD COLUMN surname TEXT;", (err: Error) => {
    if (err) {
      console.error("Erreur lors de l'ajout de la colonne 'surname'", err);
    } else {
      console.log("Colonne 'surname' ajoutée avec succès.");
    }
  });
});

export { bdd };
