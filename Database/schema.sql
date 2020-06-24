CREATE DATABASE IF NOT EXISTS RareDiagnosticsDB;
USE RareDiagnosticsDB;

-- Create user that is used in the DBMS to avoid using root
GRANT ALL PRIVILEGES ON RareDiagnosticsDB.*
    TO 'rareDiagnosticsRoot'@localhost
    IDENTIFIED BY "admin1";

DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Feedback;
DROP TABLE IF EXISTS Correlation;
DROP TABLE IF EXISTS SymptomInheritance;
DROP TABLE IF EXISTS Symptom;
DROP TABLE IF EXISTS Gene;
DROP TABLE IF EXISTS Disease;

CREATE TABLE Users (
    username VARCHAR(255),
    pass     VARCHAR(255) NOT NULL,
    email    VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (username)
);

CREATE TABLE Feedback (
    id            INT NOT NULL AUTO_INCREMENT,
    name          VARCHAR(255),
    surname       VARCHAR(255),
    email         VARCHAR(255),
    is_doctor     BOOLEAN,
    profession    VARCHAR(255),
    field_1       INT,
    field_2       INT,
    feedback_text TEXT,
    features_text TEXT,
    PRIMARY KEY(id)
);

CREATE TABLE Disease (
    orpha_number VARCHAR(10),
    disease_name VARCHAR(255),
    definition TEXT,
    prevalence_at_birth VARCHAR(255),
    annual_incidence VARCHAR(255),
    geography VARCHAR(255),
    onset_age VARCHAR(255),
    life_expectancy VARCHAR(255),
    inheritance_type VARCHAR(255),
    PRIMARY KEY (orpha_number)
);

CREATE TABLE Symptom(
    id VARCHAR(255),
    symptom_name VARCHAR(255),
    definition TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE SymptomInheritance(
    superclass_id VARCHAR(255),
    subclass_id VARCHAR(255),
    FOREIGN KEY (superclass_id) REFERENCES Symptom(id) ON DELETE SET NULL,
    FOREIGN KEY (subclass_id) REFERENCES Symptom(id) ON DELETE SET NULL
);

CREATE TABLE Correlation(
    disease_orpha VARCHAR(10),
    symptom_id VARCHAR(255),
    frequency FLOAT(3),
    FOREIGN KEY (disease_orpha) REFERENCES Disease(orpha_number) ON DELETE CASCADE,
    FOREIGN KEY (symptom_id) REFERENCES Symptom(id) ON DELETE CASCADE
);

CREATE TABLE Gene(
    disease_orpha VARCHAR(10),
    gene_name VARCHAR(255),
    gene_symbol VARCHAR(20),
    gene_type VARCHAR(255),
    FOREIGN KEY (disease_orpha) REFERENCES Disease(orpha_number) ON DELETE CASCADE
)
