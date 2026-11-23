
-- =========================================
-- JOB APPLICATION MANAGEMENT SYSTEM
-- DATABASE SETUP
-- =========================================

BEGIN;

-- 1. ADMINS TABLE

CREATE TABLE IF NOT EXISTS admins (
    admin_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


-- 2. JOB APPLICATIONS TABLE

CREATE TABLE IF NOT EXISTS job_applications (
    application_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    company_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),

    position VARCHAR(150) NOT NULL,

    experience_years INT DEFAULT 0
        CHECK (experience_years >= 0),

    status VARCHAR(30) DEFAULT 'Applied'
        CHECK (
            status IN (
                'Applied',
                'Reviewing',
                'Shortlisted',
                'Rejected'
            )
        ),

    applied_date DATE DEFAULT CURRENT_DATE,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


-- 3. INDEXES

CREATE INDEX IF NOT EXISTS idx_applications_date
ON job_applications(applied_date);

CREATE INDEX IF NOT EXISTS idx_applications_status
ON job_applications(status);


-- 4. REMOVE EXACT DUPLICATE SAMPLE RECORDS

WITH duplicate_records AS (
    SELECT
        application_id,
        ROW_NUMBER() OVER (
            PARTITION BY
                company_name,
                LOWER(email),
                phone,
                position,
                experience_years,
                status,
                applied_date
            ORDER BY application_id
        ) AS row_num
    FROM job_applications
)

DELETE FROM job_applications
WHERE application_id IN (
    SELECT application_id
    FROM duplicate_records
    WHERE row_num > 1
);


-- 5. INSERT SAMPLE APPLICATIONS
-- Prevent inserting the same applicant for the same position again

INSERT INTO job_applications (
    company_name,
    email,
    phone,
    position,
    experience_years,
    status
)
SELECT
    sample.company_name,
    sample.email,
    sample.phone,
    sample.position,
    sample.experience_years,
    sample.status
FROM (
    VALUES
    (
        'Ethics Infotech',
        'ethics@example.com',
        '9876543210',
        'Frontend Developer',
        2,
        'Applied'
    ),
    (
        'abc',
        'abc@example.com',
        '9876543211',
        'React Developer',
        3,
        'Shortlisted'
    ),
    (
        'xyz',
        'xyz@example.com',
        '9876543212',
        'UI/UX Designer',
        1,
        'Reviewing'
    ),
    (
        'kpgu',
        'kpgu@example.com',
        '9876543213',
        'Backend Developer',
        4,
        'Rejected'
    )
) AS sample(
    company_name,
    email,
    phone,
    position,
    experience_years,
    status
)

WHERE NOT EXISTS (
    SELECT 1
    FROM job_applications existing
    WHERE LOWER(existing.email) = LOWER(sample.email)
    AND LOWER(existing.position) = LOWER(sample.position)
);


COMMIT;


 