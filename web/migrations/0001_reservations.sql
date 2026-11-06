-- Migrations = versioned changes to the database structure.
-- Apply locally:      npx wrangler d1 migrations apply restaurant-test-db --local
-- Apply to production: npx wrangler d1 migrations apply restaurant-test-db --remote
CREATE TABLE reservations (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  code        TEXT    NOT NULL UNIQUE,          -- short confirmation code shown to the guest
  name        TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  phone       TEXT,
  party_size  INTEGER NOT NULL CHECK (party_size BETWEEN 1 AND 12),
  date        TEXT    NOT NULL,                 -- YYYY-MM-DD (restaurant's local date)
  time        TEXT    NOT NULL,                 -- HH:MM
  notes       TEXT,
  status      TEXT    NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_reservations_slot ON reservations (date, time, status);
