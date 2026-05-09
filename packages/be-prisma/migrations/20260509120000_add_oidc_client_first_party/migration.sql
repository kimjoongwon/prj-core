ALTER TABLE "oidc_clients"
ADD COLUMN "is_first_party" BOOLEAN NOT NULL DEFAULT false;

UPDATE "oidc_clients"
SET "is_first_party" = true
WHERE "client_id" IN (
	'admin-web',
	'storybook-web',
	'idp-web',
	'user-mobile',
	'swagger-web'
);

UPDATE "oidc_clients"
SET "skip_consent" = false
WHERE "is_first_party" = false;
