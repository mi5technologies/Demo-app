-- Seed employees
INSERT INTO employees (name, email, department, role) VALUES
    ('John Doe', 'john.doe@company.com', 'Engineering', 'employee'),
    ('Jane Smith', 'jane.smith@company.com', 'Engineering', 'employee'),
    ('Alice Johnson', 'alice.johnson@company.com', 'Product', 'employee'),
    ('Bob Williams', 'bob.williams@company.com', 'Design', 'employee'),
    ('Charlie Brown', 'charlie.brown@company.com', 'Marketing', 'employee'),
    ('Diana Prince', 'diana.prince@company.com', 'Sales', 'employee'),
    ('Admin User', 'admin@company.com', 'Management', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Seed sample attendance records (last 7 days)
INSERT INTO attendance (employee_id, date, check_in, check_out) VALUES
    -- 7 days ago
    (1, CURRENT_DATE - INTERVAL '7 days', (CURRENT_DATE - INTERVAL '7 days') + TIME '09:00:00', (CURRENT_DATE - INTERVAL '7 days') + TIME '18:00:00'),
    (2, CURRENT_DATE - INTERVAL '7 days', (CURRENT_DATE - INTERVAL '7 days') + TIME '08:45:00', (CURRENT_DATE - INTERVAL '7 days') + TIME '17:30:00'),
    (3, CURRENT_DATE - INTERVAL '7 days', (CURRENT_DATE - INTERVAL '7 days') + TIME '09:15:00', (CURRENT_DATE - INTERVAL '7 days') + TIME '18:15:00'),
    
    -- 6 days ago
    (1, CURRENT_DATE - INTERVAL '6 days', (CURRENT_DATE - INTERVAL '6 days') + TIME '09:05:00', (CURRENT_DATE - INTERVAL '6 days') + TIME '18:10:00'),
    (2, CURRENT_DATE - INTERVAL '6 days', (CURRENT_DATE - INTERVAL '6 days') + TIME '08:50:00', (CURRENT_DATE - INTERVAL '6 days') + TIME '17:45:00'),
    (4, CURRENT_DATE - INTERVAL '6 days', (CURRENT_DATE - INTERVAL '6 days') + TIME '09:00:00', (CURRENT_DATE - INTERVAL '6 days') + TIME '18:00:00'),
    
    -- 5 days ago
    (1, CURRENT_DATE - INTERVAL '5 days', (CURRENT_DATE - INTERVAL '5 days') + TIME '08:55:00', (CURRENT_DATE - INTERVAL '5 days') + TIME '17:55:00'),
    (3, CURRENT_DATE - INTERVAL '5 days', (CURRENT_DATE - INTERVAL '5 days') + TIME '09:10:00', (CURRENT_DATE - INTERVAL '5 days') + TIME '18:20:00'),
    (5, CURRENT_DATE - INTERVAL '5 days', (CURRENT_DATE - INTERVAL '5 days') + TIME '09:00:00', (CURRENT_DATE - INTERVAL '5 days') + TIME '18:00:00'),
    
    -- 4 days ago
    (1, CURRENT_DATE - INTERVAL '4 days', (CURRENT_DATE - INTERVAL '4 days') + TIME '09:00:00', (CURRENT_DATE - INTERVAL '4 days') + TIME '18:05:00'),
    (2, CURRENT_DATE - INTERVAL '4 days', (CURRENT_DATE - INTERVAL '4 days') + TIME '08:45:00', (CURRENT_DATE - INTERVAL '4 days') + TIME '17:40:00'),
    (6, CURRENT_DATE - INTERVAL '4 days', (CURRENT_DATE - INTERVAL '4 days') + TIME '09:00:00', (CURRENT_DATE - INTERVAL '4 days') + TIME '18:00:00'),
    
    -- 3 days ago
    (1, CURRENT_DATE - INTERVAL '3 days', (CURRENT_DATE - INTERVAL '3 days') + TIME '09:02:00', (CURRENT_DATE - INTERVAL '3 days') + TIME '18:00:00'),
    (3, CURRENT_DATE - INTERVAL '3 days', (CURRENT_DATE - INTERVAL '3 days') + TIME '09:15:00', (CURRENT_DATE - INTERVAL '3 days') + TIME '18:30:00'),
    (4, CURRENT_DATE - INTERVAL '3 days', (CURRENT_DATE - INTERVAL '3 days') + TIME '09:00:00', (CURRENT_DATE - INTERVAL '3 days') + TIME '18:00:00'),
    
    -- 2 days ago
    (1, CURRENT_DATE - INTERVAL '2 days', (CURRENT_DATE - INTERVAL '2 days') + TIME '08:58:00', (CURRENT_DATE - INTERVAL '2 days') + TIME '17:58:00'),
    (2, CURRENT_DATE - INTERVAL '2 days', (CURRENT_DATE - INTERVAL '2 days') + TIME '08:50:00', (CURRENT_DATE - INTERVAL '2 days') + TIME '17:50:00'),
    (5, CURRENT_DATE - INTERVAL '2 days', (CURRENT_DATE - INTERVAL '2 days') + TIME '09:00:00', (CURRENT_DATE - INTERVAL '2 days') + TIME '18:00:00'),
    
    -- Yesterday
    (1, CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day') + TIME '09:00:00', (CURRENT_DATE - INTERVAL '1 day') + TIME '18:00:00'),
    (2, CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day') + TIME '08:45:00', (CURRENT_DATE - INTERVAL '1 day') + TIME '17:45:00'),
    (3, CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day') + TIME '09:10:00', (CURRENT_DATE - INTERVAL '1 day') + TIME '18:10:00'),
    (4, CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day') + TIME '09:05:00', (CURRENT_DATE - INTERVAL '1 day') + TIME '18:05:00')
ON CONFLICT (employee_id, date) DO NOTHING;
