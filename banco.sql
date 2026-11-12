CREATE DATABASE IF NOT EXISTS laboratorio_ensaios
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE laboratorio_ensaios;

CREATE TABLE IF NOT EXISTS ensaio (
  id_ensaio INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  norma VARCHAR(150) NOT NULL,
  status VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_ensaio)
);

CREATE TABLE IF NOT EXISTS equipamento (
  id_equipamento INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  patrimonio VARCHAR(100) NOT NULL,
  situacao VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_equipamento)
);

CREATE TABLE IF NOT EXISTS analista (
  id_analista INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  registro VARCHAR(100) NOT NULL,
  especialidade VARCHAR(150) NOT NULL,
  PRIMARY KEY (id_analista)
);