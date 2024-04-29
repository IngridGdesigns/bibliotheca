const pool = require('../database')// Import your PostgreSQL connection pool


/********************************
        Category table CRUD 
********************************/


// Gets all categories table 
const getCategories = async (req, res) => {
   
    const client = await pool.connect();
    
    client.query('SELECT * FROM category', (err, results) => {
        if (err) {
            console.log('error oh noes!!', err)
            res.status(500).send('Server error');
            client.release()
        }
        else {
            console.log('data fetched successfully');
            res.status(200).json(results.rows) 
            client.release()//closes database
        }
    })
};

// get category by id
const getCategoryById = async (req, res) => {
    const client = await pool.connect();
    let id = parseInt(req.params.category_id);

    await client.query('SELECT * FROM category WHERE category_id = $1', [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
            client.release()
        }
        else { //res.json(dbitems.rows[0] )
            res.status(200).json(result.rows[0])
            client.release()
        }
    })
};

/********************************************************* 
 
    Create - Update - Done only by Librarian or Admin -- MVP 

********************************************************* */

// add new category post/
const createCategory = async (req, res) => {
    const client = await pool.connect();

    let category_name = req.body.category_name;

    await client.query('INSERT INTO category(category_name) VALUES($1) RETURNING *',
        [category_name], (err, result) => {
            if (err) {
                res.status(500).send('Server error')
                client.release()
            } else {
                res.status(200).json(result.rows[0])
                client.release()
            }
    })
}

// update category by category id
const updateCategoryById = async (req, res) => {
    const client = await pool.connect();
    const categoryId = parseInt(req.params.category_id);
    
    const { category_name } = req.body;
    
    try {
        let res = await client.query(
            'UPDATE category SET category_name = $1 WHERE category_id = $5 RETURNING *',
            [category_name, categoryId])
        
        res.status(200).json(`This category with the id: ${categoryId} was updated!`)
    } catch (err) {
        res.status(500).send(err);
    } finally {
        client.release()
    }
};

// // delete by category id
// api.delete('/:category_id', async (req, res) => {
//     const client = await pool.connect();
//     const categoryId = parseInt(req.params.category_id);
    
//     const { category_name } = req.body;


//     await client.query(
//             'DELETE category WHERE category_id = $1', [categoryId], (err, result) => {
//          if(err){
//            console.log('Oh noes you have an error!!')
//            res.status(500).send('There is a server error')
//            client.release()
//        }
//        else {
//            console.log(`category:${category_name} - ${categoryId} was succesfully deleted`)
//            res.status(200).end()
//            client.release()
//        }
//    })
// })

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategoryById
}
