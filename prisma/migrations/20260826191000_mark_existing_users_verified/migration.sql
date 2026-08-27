-- Mark users created before email verification was introduced as verified.
UPDATE "User"
SET "emailVerified" = true
WHERE "emailVerified" = false;
