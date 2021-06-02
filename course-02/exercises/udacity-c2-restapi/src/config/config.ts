export const config = {
  "dev": {
    "username": process.env.PGUSER_UDEMY,
    "password": process.env.PGPASSWORD_UDEMY,
    "database": process.env.PG_DATABASE,
    "host": process.env.PG_HOST,
    "dialect": process.env.PG_DIALECT,
    "aws_region": process.env.AWS_REGION,
    "aws_profile": process.env.AWS_PROFILE,
    "aws_media_bucket": process.env.AWS_MEDIA_BUCKET
  },
  "prod": {
    "username": process.env.PGUSER_UDEMY,
    "password": process.env.PGPASSWORD_UDEMY,
    "database": process.env.PG_DATABASE,
    "host": process.env.PG_HOST,
    "dialect": process.env.PG_DIALECT
  },
  "jwt":{
    "secret": process.env.JWT_SECRET
  }
}
