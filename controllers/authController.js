const bcrypt = require('bcrypt');
const db = require('../config/database');

// Registro de usuario
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Validar datos de entrada
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err, results) => {
        if (err) {
            console.error('Error registering user:', err);
            return res.status(500).json({ error: 'Error registering user.' });
        }
        res.status(201).json({ message: 'User registered successfully!' });
    });
};

// Login de usuario
const loginUser = (req, res) => {
    const { email, password } = req.body;

    // Validar datos de entrada
    if (!email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('Error logging in:', err);
            return res.status(500).json({ error: 'Error logging in.' });
        }
        if (results.length > 0) {
            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return res.status(200).json({ message: 'Login successful!' });
            }
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        res.status(404).json({ error: 'User not found.' });
    });
};

module.exports = { registerUser, loginUser };
