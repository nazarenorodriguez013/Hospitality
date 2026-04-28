const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todas las habitaciones y su estado
const getRooms = async (req, res) => {
    try {
        const rooms = await prisma.rooms.findMany({
            orderBy: { room_number: 'asc' }
        });
        res.json({ success: true, data: rooms });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener habitaciones' });
    }
};

// Obtener reservas activas (In-House) con información del huésped y folio
const getActiveReservations = async (req, res) => {
    try {
        const reservations = await prisma.reservations.findMany({
            where: { status: 'In-House' },
            include: {
                guests: true,
                rooms: true,
                folios: {
                    include: {
                        folio_transactions: true
                    }
                }
            }
        });
        res.json({ success: true, data: reservations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener reservas activas' });
    }
};

module.exports = {
    getRooms,
    getActiveReservations
};
