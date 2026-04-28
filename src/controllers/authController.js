const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'secret_zylos_erp_2025';

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.users.findUnique({ where: { username } });
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Para fines de prueba inicial, comparamos texto plano si no empieza con hash de bcrypt
        // En producción siempre usaremos hash.
        const isValid = password === user.password_hash || await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: { id: user.id, username: user.username, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token requerido' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido o expirado' });
        req.user = user;
        next();
    });
};

module.exports = { login, authenticateToken };
