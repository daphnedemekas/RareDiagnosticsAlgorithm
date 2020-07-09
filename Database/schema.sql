CREATE DATABASE IF NOT EXISTS RareDiagnostics;
USE RareDiagnostics;

DROP TABLE IF EXISTS Correlations;
DROP TABLE IF EXISTS SymptomInheritances;
DROP TABLE IF EXISTS DiseaseSynonyms;
DROP TABLE IF EXISTS Symptoms;
DROP TABLE IF EXISTS Diseases;


CREATE TABLE Diseases (
    orpha_number VARCHAR(10),
    disease_name VARCHAR(255),
    type VARCHAR(100),
    definition TEXT,
    PRIMARY KEY (orpha_number)
);

CREATE TABLE Symptoms(
    id VARCHAR(255),
    symptom_name VARCHAR(255),
    definition TEXT,
    PRIMARY KEY (id)
);
CREATE TABLE Correlations(
    disease_orpha VARCHAR(10),
    symptom_id VARCHAR(255),
    frequency FLOAT(3),
    FOREIGN KEY (disease_orpha) REFERENCES Disease(orpha_number) ON DELETE CASCADE,
    FOREIGN KEY (symptom_id) REFERENCES Symptom(id) ON DELETE CASCADE
);

CREATE TABLE DiseaseSynonyms(
  disease_orpha VARCHAR(10),
  synonym VARCHAR(255),
  FOREIGN KEY (disease_orpha) REFERENCES Disease(orpha_number) ON DELETE CASCADE
);

CREATE TABLE SymptomInheritances(
    superclass_id VARCHAR(255),
    subclass_id VARCHAR(255),
    FOREIGN KEY (superclass_id) REFERENCES Symptom(id) ON DELETE SET NULL,
    FOREIGN KEY (subclass_id) REFERENCES Symptom(id) ON DELETE SET NULL
);
