//require posgresql
const Pool = require('pg').Pool;

//Postgresql connection configuration
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: 5432,
})

pool.on('error', (error) => {
    console.error('Unexpected error on idle client', error);
    process.exit(-1); // Exit the application on error
});

module.exports = pool;