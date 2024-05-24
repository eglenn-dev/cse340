-- Inserting Tony Stark Into the Database
INSERT INTO
    public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );

-- Update Tony Stark account type
UPDATE public.account
    SET account_type = 'Admin'::account_type
WHERE
    account_email = 'tony@starkent.com';

-- Delete tony stark from the database
DELETE FROM public.account
WHERE
    account_email = 'tony@starkent.com';

-- Hummer Description Update
UPDATE public.inventory
SET
    inv_description =
REPLACE (
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE
    inv_make = 'GM'
    AND inv_model = 'Hummer';

-- Inner Join Practice
SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory i
    INNER JOIN public.classification c ON i.classification_id = c.classification_id
WHERE
    c.classification_name = 'Sport';

-- Update file path in the inventory table
UPDATE public.inventory
SET
    inv_image =
REPLACE (
        inv_image,
        '/images/',
        '/images/vehicles/'
    ),
    inv_thumbnail =
REPLACE (
        inv_thumbnail,
        '/images/',
        '/images/vehicles/'
    )