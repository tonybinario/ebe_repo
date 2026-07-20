-- 1. BUILDINGS
CREATE TABLE buildings (
                           id SERIAL PRIMARY KEY,
                           founder_user_id INTEGER, -- Wird am Ende als Fremdschlüssel verknüpft
                           address VARCHAR(255) NOT NULL,
                           latitude DOUBLE PRECISION NOT NULL,
                           longitude DOUBLE PRECISION NOT NULL,
                           radius_meters DOUBLE PRECISION NOT NULL,
                           building_token VARCHAR(255) NOT NULL,
                           max_capacity INTEGER NOT NULL,
                           current_count INTEGER NOT NULL DEFAULT 0
);

-- 2. HOUSEHOLDS
CREATE TABLE households (
                            id SERIAL PRIMARY KEY,
                            building_id INTEGER NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
                            apartment_name VARCHAR(255) NOT NULL,
                            is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 3. USERS
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       household_id INTEGER REFERENCES households(id) ON DELETE SET NULL,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
                       is_building_admin BOOLEAN NOT NULL DEFAULT FALSE
);

-- Nachträgliche Fremdschlüssel-Verknüpfung für den Gebäude-Gründer
ALTER TABLE buildings
    ADD CONSTRAINT fk_buildings_founder_user
        FOREIGN KEY (founder_user_id) REFERENCES users(id) ON DELETE SET NULL;