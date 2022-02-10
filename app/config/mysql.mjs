import knex from 'knex'
import bookshelf from 'bookshelf'
import eloquent from 'bookshelf-eloquent'
import softDeletes   from 'bookshelf-paranoia'
import dotenv from 'dotenv'
dotenv.config()

const main = knex({
    client: 'mysql2',
    connection: {
      host     : process.env.DB_HOST,
      user     : process.env.DB_USERNAME,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_DATABASE,
      charset  : 'utf8'
    },
    pool: { min: 2, max: 10 },
});

const DB = bookshelf(main)
DB.plugin('registry')
DB.plugin('pagination')
DB.plugin('bookshelf-virtuals-plugin')
DB.plugin(eloquent)
DB.plugin(softDeletes, { field: 'deleted_at' });

export default DB