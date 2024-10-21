// controllers/userController.js
import sql from 'mssql';
import bcrypt from 'bcrypt';

// GET all users
export const getUsers = async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Users`;
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving users' });
    }
};

// GET user by ID
export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`SELECT * FROM Users WHERE UserID = ${id}`;
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving user' });
    }
};

// CREATE a new user
export const createUser = async (req, res) => {
    const { Username, Email, Password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const PasswordHash = await bcrypt.hash(Password, salt);
        const result = await sql.query`INSERT INTO Users (Username, Email, PasswordHash) VALUES (${Username}, ${Email}, ${PasswordHash})`;
        res.status(201).json({ message: 'User created successfully', UserId: result.recordset.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating user' });
    }
};
// UPDATE a user
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { Username, Email, PasswordHash } = req.body;
    try {
        const result = await sql.query`UPDATE Users SET Username = ${Username}, Email = ${Email}, PasswordHash = ${PasswordHash} WHERE UserID = ${id}`;
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating user' });
    }
};

// DELETE a user
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`DELETE FROM Users WHERE UserID = ${id}`;
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting user' });
    }
};
