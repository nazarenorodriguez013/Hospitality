const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Procesa una venta y descuenta inventario
const createOrder = async (req, res) => {
    const { table_id, items, payment_method, reservation_id } = req.body;
    const user_id = req.user.id; // Obtenido del token JWT

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Calcular total
            let total = 0;
            for (const item of items) {
                const product = await tx.products.findUnique({ where: { id: item.product_id } });
                total += Number(product.price) * item.quantity;
            }

            // 2. Crear la orden
            const order = await tx.pos_orders.create({
                data: {
                    table_id,
                    user_id,
                    total_amount: total,
                    status: payment_method === 'Cargo a Habitación' ? 'Cargada_a_Habitacion' : 'Pagada'
                }
            });

            // 3. Crear items y procesar inventario
            for (const item of items) {
                await tx.pos_order_items.create({
                    data: {
                        pos_order_id: order.id,
                        product_id: item.product_id,
                        quantity: item.quantity,
                        unit_price: item.price
                    }
                });

                // Lógica de Escandallos (Recetas)
                const recipe = await tx.recipes.findMany({ where: { product_id: item.product_id } });
                for (const ingredient of recipe) {
                    const qtyToDeduct = Number(ingredient.quantity) * item.quantity;
                    
                    // Actualizar stock
                    await tx.ingredients.update({
                        where: { id: ingredient.ingredient_id },
                        data: { current_stock: { decrement: qtyToDeduct } }
                    });

                    // Registrar movimiento
                    await tx.inventory_transactions.create({
                        data: {
                            ingredient_id: ingredient.ingredient_id,
                            transaction_type: 'Salida',
                            quantity: qtyToDeduct,
                            reason: `Venta Orden #${order.id}`
                        }
                    });
                }
            }

            // 4. Si es cargo a habitación, registrar en Folio
            if (payment_method === 'Cargo a Habitación' && reservation_id) {
                const folio = await tx.folios.findFirst({ where: { reservation_id } });
                if (folio) {
                    await tx.folio_transactions.create({
                        data: {
                            folio_id: folio.id,
                            transaction_type: 'Cargo',
                            description: `Consumo Restaurante - Orden #${order.id}`,
                            amount: total,
                            pos_order_id: order.id
                        }
                    });
                }
            }

            return order;
        });

        res.json({ success: true, order: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al procesar la venta' });
    }
};

module.exports = { createOrder };
