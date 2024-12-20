-- Create database if not exists
CREATE DATABASE IF NOT EXISTS prfut_db;
USE prfut_db;

-- Create table for bets
CREATE TABLE IF NOT EXISTS apostas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_aposta DATE NOT NULL,
    hora_aposta TIME NOT NULL,
    pais VARCHAR(100) NOT NULL,
    liga VARCHAR(100) NOT NULL,
    time_casa VARCHAR(100) NOT NULL,
    time_visitante VARCHAR(100) NOT NULL,
    mercado VARCHAR(100) NOT NULL,
    metodo VARCHAR(100) NOT NULL,
    stake DECIMAL(10,2) NOT NULL,
    casa_aposta VARCHAR(100) NOT NULL,
    odd_entrada DECIMAL(10,2) NOT NULL,
    tipo_entrada ENUM('Pré Live', 'Live') NOT NULL,
    tipo_operacao ENUM('Back', 'Lay') NOT NULL,
    tipo_saida ENUM('Punter', 'Cashout', 'Freebet') NOT NULL,
    pl DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_data ON apostas(data_aposta);
CREATE INDEX idx_mercado ON apostas(mercado);
CREATE INDEX idx_metodo ON apostas(metodo);
CREATE INDEX idx_liga ON apostas(liga);
CREATE INDEX idx_times ON apostas(time_casa, time_visitante);
