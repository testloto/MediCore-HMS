-- Drop tables if they exist (for clean setup)
-- SET FOREIGN_KEY_CHECKS = 0;
-- DROP TABLE IF EXISTS users, patients, doctors, appointments, invoices, invoice_items,
-- lab_tests, lab_requests, lab_results, medicines, prescriptions, prescription_items,
-- stock_movements, staff;
-- SET FOREIGN_KEY_CHECKS = 1;

-- Create enum types as ENUM in MySQL
CREATE TABLE IF NOT EXISTS role_enum (
    role_name VARCHAR(20) PRIMARY KEY
);

INSERT IGNORE INTO role_enum VALUES
('ADMIN'), ('DOCTOR'), ('NURSE'), ('RECEPTIONIST'), ('PHARMACIST'), ('LAB_TECHNICIAN'), ('STAFF');

-- Note: Most tables will be auto-created by Hibernate
-- This file is for initial data seeding if needed