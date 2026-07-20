-- 1. Datenbank steril machen und IDs zurücksetzen
TRUNCATE users, households, buildings RESTART IDENTITY CASCADE;

-- 2. 100 Gebäude generieren (founder_user_id bleibt vorerst NULL)
INSERT INTO buildings (address, latitude, longitude, radius_meters, building_token, max_capacity, current_count)
SELECT
    'Strasse der sauberen Daten ' || g,
    52.5200 + (g * 0.0001),         -- Beispiel-Koordinaten (Breitengrad)
    13.4050 + (g * 0.0001),         -- Beispiel-Koordinaten (Längengrad)
    100.0,                          -- radiusMeters
    'token_secret_abc_' || g,       -- buildingToken
    100,                            -- maxCapacity
    48                             -- currentCount (da wir gleich 100 User pro Gebäude reinsetzen)
FROM generate_series(1, 100) AS g;

-- 3. 10.000 HAUSHALTE GENERIEREN (100 pro Gebäude)
INSERT INTO households (building_id, apartment_name, is_active)
SELECT
    ((h - 1) / 100) + 1,            -- Ordnet 100 Haushalte jeweils einem Gebäude zu
    'Apt ' || (((h - 1) % 100) + 101),
    TRUE                            -- isActive
FROM generate_series(1, 10000) AS h;

-- 4. 10.000 BENUTZER GENERIEREN (Exakt 1 User pro Haushalt)
INSERT INTO users (household_id, email, is_email_verified, is_building_admin)
SELECT
    u,                              -- 1:1 Kopplung (User ID matched exakt mit Household ID)
    'user.' || u || '@ebe-projekt.edu', -- Geänderte Domain
    TRUE,                           -- isEmailVerified
    CASE WHEN (u - 1) % 100 = 0 THEN TRUE ELSE FALSE END -- Der jeweils erste User eines Gebäudes wird Admin
FROM generate_series(1, 10000) AS u;

-- 5. Nachträglich den Gebäude-Gründer (founder_user_id) setzen
-- Wir nehmen hier einfach den jeweils ersten User des Gebäudes als Gründer
UPDATE buildings
SET founder_user_id = ((id - 1) * 100) + 1;

-- Sichern
COMMIT;
