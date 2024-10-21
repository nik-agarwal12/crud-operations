import bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
    const { Username, Email, Password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const PasswordHash = await bcrypt.hash(Password, salt);
        const result = await sql.query`INSERT INTO Users (Username, Email, PasswordHash) VALUES (${Username}, ${Email}, ${PasswordHash})`;
        res.status(201).json({ message: 'User created successfully', userId: result.recordset.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating user' });
    }
};
