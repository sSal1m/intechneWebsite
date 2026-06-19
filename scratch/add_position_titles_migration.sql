-- Add columns to persist position title in job applications
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS position_title_tr VARCHAR(255);
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS position_title_en VARCHAR(255);
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS original_position_id UUID;

-- Add active status column to job positions
ALTER TABLE job_positions ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing rows based on the current job positions (migration)
UPDATE job_applications ja
SET position_title_tr = jp.title_tr,
    position_title_en = jp.title_en,
    original_position_id = ja.position_id
FROM job_positions jp
WHERE ja.position_id = jp.id;
