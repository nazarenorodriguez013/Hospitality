const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todo el menú categorizado
const getMenu = async (req, res) => {
    try {
        const categories = await prisma.product_categories.findMany({
            include: {
                products: {
                    where: { is_active: true }
                }
            }
        });
        res.json({ success: true, data: categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener el menú' });
    }
};

// Obtener estado de las mesas
const getTables = async (req, res) => {
    try {
        const tables = await prisma.tables.findMany({
            orderBy: { table_number: 'asc' }
        });
        res.json({ success: true, data: tables });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener mesas' });
    }
};

module.exports = {
    getMenu,
    getTables
};
