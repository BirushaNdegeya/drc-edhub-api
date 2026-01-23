-- 002-add-matricule-to-schools.sql
-- Adds the "matricule" column to the "schools" table to match the School model

ALTER TABLE "schools"
ADD COLUMN IF NOT EXISTS "matricule" VARCHAR;

