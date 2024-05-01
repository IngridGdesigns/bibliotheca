const pool = require('../database');

/********************************
        Staff library table CRUD 
********************************/

// Read all library staff members
const getAllStaffMembers = async (req, res) => {
    try {
        const client = await pool.connect();
        const { rows } = await client.query('SELECT * FROM library_staff');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching library staff:', error);
        res.status(500).send('Server error');
    }
};

// Read all library staff members
const getStaffMember = async (req, res) => {
    const staff_id = parseInt(req.params.staff_id)

    await client.query('SELECT * FROM library_staff WHERE staff_id =$1', [staff_id], (err, result) => {
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


// Create new library staff
const createStaffMember = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const client = await pool.connect();
        const queryText = 'INSERT INTO library_staff (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [name, email, password, role];
        const { rows } = await client.query(queryText, values);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error creating library staff:', error);
        res.status(500).send('Server error');
    }
};

// Update library staff member 
const updateStaffInfo =  async (req, res) => {
    const staff_id = parseInt(req.params.staff_id);
    const { name, email, password, role } = req.body;

    try {
        const client = await pool.connect();
        const queryText = 'UPDATE library_staff SET name = $1, email = $2, password = $3, role = $4 WHERE staff_id = $5 RETURNING *';
        const values = [name, email, password, role, staff_id];
        const { rows } = await client.query(queryText, values);
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error updating library staff:', error);
        res.status(500).send('Server error');
    }
};

// Delete library staff member
// const  .delete('/:staff_id', async (req, res) => {
//     const staff_id = req.params.staff_id;

//     try {
//         const client = await pool.connect();
//         await client.query('DELETE FROM library_staff WHERE staff_id = $1', [staff_id]);
//         res.status(204).send();
//     } catch (error) {
//         console.error('Error deleting library staff:', error);
//         res.status(500).send('Server error');
//     }
// });

module.exports = {
    getAllStaffMembers,
    getStaffMember,
    createStaffMember,
    updateStaffInfo
}
