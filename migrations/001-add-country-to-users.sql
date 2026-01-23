-- Migration: add country column to users table
-- Run this SQL against your Postgres database (e.g. via psql or a DB client)

ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "country" VARCHAR NULL;

