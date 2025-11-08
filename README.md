favicon harus dengan dimensi pixel 64x64


### prisma
### jangan pernah gunakan npx prisma migrate reset di prod (data akan hilang)
# checking is db sync with schema in prisma
npx prisma migrate diff \
  --from-url "$(grep DATABASE_URL .env | cut -d '=' -f2- | tr -d '"' )" \
  --to-schema-datamodel prisma/schema.prisma 

# push synch schema to db server (with warning if there is table needed to be deleted by there is data in it)
npx prisma db push

# baselining production schema  
https://www.prisma.io/docs/orm/prisma-migrate/workflows/baselining

# any changes of db in prisma schema use to list new migrations
npx prisma migrate dev --name xxxx_add_products_table

# deploy changes in tables
npx prisma migrate deploy

### hashing 
untuk hashing password bisa via terminal gunakan

npm run hash string_xxxx

### DB and stuff

# make sure the DB user is able to create db  
alter developeruser with CREATEDB

# add platform user
INSERT INTO "platform_users" (username, password)
VALUES (
  'metrindomp',
  '$2b$12$VCz2j51VJoTnX1xRLnvFOe081yfKoY/7GjUKgARZCCfVMsm/sfsuS'
);