-- Phase 1 Migration: Domain Model Stabilization
-- This migration updates the hospital-queue-system database schema
-- with the frozen domain model as per Phase 1 requirements

-- Note: Hibernate with ddl-auto=update will handle most of this automatically
-- This file documents the schema changes for reference

-- Updates to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- Updates to appointments table
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS booked_by_user_id BIGINT,
ADD COLUMN IF NOT EXISTS appointment_type VARCHAR(20),
ADD COLUMN IF NOT EXISTS queue_number INT,
ADD COLUMN IF NOT EXISTS meeting_link VARCHAR(250),
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20);

ALTER TABLE appointments
MODIFY COLUMN status VARCHAR(20);

-- Add foreign key for booked_by_user_id
ALTER TABLE appointments 
ADD CONSTRAINT fk_appointments_booked_by_user_id 
FOREIGN KEY (booked_by_user_id) REFERENCES users(id);

-- Updates to doctors table
ALTER TABLE doctors
ADD COLUMN IF NOT EXISTS clinic_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS district VARCHAR(100),
ADD COLUMN IF NOT EXISTS taluka VARCHAR(100);

-- Updates to staff table
ALTER TABLE staff
ADD COLUMN IF NOT EXISTS clinic_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS district VARCHAR(100),
ADD COLUMN IF NOT EXISTS taluka VARCHAR(100);

-- Updates to payments table
ALTER TABLE payments 
MODIFY COLUMN status VARCHAR(20);

-- Create indexes for frequently queried columns (Phase 1.3 - indexing ready)
-- To be added in Phase 8
