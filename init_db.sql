-- ==============================================================================
-- ERP Hospitality - Arquitectura de Base de Datos (PostgreSQL)
-- Script de Creación y Poblado de Datos Iniciales (Mock Data)
-- ==============================================================================

-- ==============================================================================
-- 1. CREACIÓN DE TABLAS Y RELACIONES
-- ==============================================================================

-- Usuarios del Sistema
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Recepcion', 'Camarero', 'Cocina')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Huéspedes
CREATE TABLE IF NOT EXISTS guests (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(50),
    document_number VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Habitaciones
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(10) UNIQUE NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    capacity INT NOT NULL,
    status VARCHAR(20) DEFAULT 'Limpia' CHECK (status IN ('Sucia', 'Limpia', 'Inspeccionada', 'Mantenimiento'))
);

-- Reservas
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    guest_id INT REFERENCES guests(id),
    room_id INT REFERENCES rooms(id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Confirmada' CHECK (status IN ('Confirmada', 'In-House', 'Checked-Out', 'Cancelada')),
    credit_limit DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Folios (Cuentas Centralizadas de la Reserva)
CREATE TABLE IF NOT EXISTS folios (
    id SERIAL PRIMARY KEY,
    reservation_id INT REFERENCES reservations(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'Abierto' CHECK (status IN ('Abierto', 'Cerrado')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transacciones del Folio (Cargos y Pagos)
CREATE TABLE IF NOT EXISTS folio_transactions (
    id SERIAL PRIMARY KEY,
    folio_id INT REFERENCES folios(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('Cargo', 'Pago')),
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    pos_order_id INT, -- Puede ser null si el cargo es de alojamiento
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mesas (Restaurante)
CREATE TABLE IF NOT EXISTS tables (
    id SERIAL PRIMARY KEY,
    table_number INT UNIQUE NOT NULL,
    zone VARCHAR(50) DEFAULT 'Salon Principal',
    capacity INT NOT NULL,
    status VARCHAR(20) DEFAULT 'Libre' CHECK (status IN ('Libre', 'Ocupada'))
);

-- Categorías de Productos
CREATE TABLE IF NOT EXISTS product_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Productos (Menú POS)
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES product_categories(id),
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    requires_kitchen BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Ingredientes (Inventario Físico)
CREATE TABLE IF NOT EXISTS ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    unit_of_measure VARCHAR(20) NOT NULL, -- Kg, Lt, Unid
    current_stock DECIMAL(10, 3) DEFAULT 0.000,
    min_stock_alert DECIMAL(10, 3) DEFAULT 5.000
);

-- Recetas / Escandallos
CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES ingredients(id),
    quantity DECIMAL(10, 3) NOT NULL,
    UNIQUE(product_id, ingredient_id)
);

-- Pedidos POS (Cabecera)
CREATE TABLE IF NOT EXISTS pos_orders (
    id SERIAL PRIMARY KEY,
    table_id INT REFERENCES tables(id),
    user_id INT REFERENCES users(id), -- Camarero
    status VARCHAR(20) DEFAULT 'Abierta' CHECK (status IN ('Abierta', 'Pagada', 'Cargada_a_Habitacion', 'Anulada')),
    total_amount DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Detalle del Pedido POS
CREATE TABLE IF NOT EXISTS pos_order_items (
    id SERIAL PRIMARY KEY,
    pos_order_id INT REFERENCES pos_orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    kitchen_status VARCHAR(20) DEFAULT 'Pendiente' CHECK (kitchen_status IN ('Pendiente', 'En_Preparacion', 'Listo', 'Entregado'))
);

-- Transacciones de Inventario
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id SERIAL PRIMARY KEY,
    ingredient_id INT REFERENCES ingredients(id),
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('Entrada', 'Salida', 'Merma')),
    quantity DECIMAL(10, 3) NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==============================================================================
-- 2. INSERCIÓN DE DATOS DE PRUEBA (MOCK DATA)
-- ==============================================================================

-- Usuarios del Sistema
INSERT INTO users (username, password_hash, role) VALUES 
('admin_sys', 'hash_falso_admin', 'Admin'),
('recepcion_dia', 'hash_falso_recep', 'Recepcion'),
('camarero_juan', 'hash_falso_cama', 'Camarero'),
('cocinero_jefe', 'hash_falso_coci', 'Cocina');

-- 20 Habitaciones (Usando generate_series para eficiencia)
INSERT INTO rooms (room_number, room_type, capacity, status)
SELECT 
    (100 + i)::varchar, 
    CASE WHEN i % 5 = 0 THEN 'Suite' ELSE 'Standard' END,
    CASE WHEN i % 5 = 0 THEN 4 ELSE 2 END,
    'Limpia'
FROM generate_series(1, 20) AS i;

-- 10 Mesas (Interior y Terraza)
INSERT INTO tables (table_number, zone, capacity, status)
SELECT 
    i, 
    CASE WHEN i <= 6 THEN 'Interior' ELSE 'Terraza' END,
    CASE WHEN i % 3 = 0 THEN 6 ELSE 4 END,
    'Libre'
FROM generate_series(1, 10) AS i;

-- Categorías de Menú
INSERT INTO product_categories (name) VALUES 
('Bebidas sin Alcohol'), ('Cervezas'), ('Vinos'), ('Entradas'), ('Platos Principales'), ('Postres');

-- 50 Productos Reales (Categorizados)
INSERT INTO products (category_id, name, price, requires_kitchen) VALUES
-- Bebidas sin Alcohol (8)
(1, 'Agua Mineral', 2.50, false), (1, 'Coca Cola', 3.00, false), (1, 'Jugo de Naranja', 4.00, false), (1, 'Limonada', 3.50, false), (1, 'Agua con Gas', 2.50, false), (1, 'Sprite', 3.00, false), (1, 'Té Helado', 3.50, false), (1, 'Café Espresso', 2.00, false),
-- Cervezas (5)
(2, 'Cerveza Artesanal IPA', 6.00, false), (2, 'Cerveza Lager', 5.00, false), (2, 'Cerveza Negra', 6.00, false), (2, 'Cerveza Sin Alcohol', 4.50, false), (2, 'Pinta APA', 6.50, false),
-- Vinos (5)
(3, 'Copa Vino Tinto', 7.00, false), (3, 'Copa Vino Blanco', 7.00, false), (3, 'Botella Malbec', 25.00, false), (3, 'Botella Cabernet', 28.00, false), (3, 'Botella Chardonnay', 22.00, false),
-- Entradas (10)
(4, 'Empanada de Carne', 3.50, true), (4, 'Empanada de Queso', 3.00, true), (4, 'Provoleta', 8.50, true), (4, 'Papas Fritas', 5.00, true), (4, 'Aros de Cebolla', 6.00, true), (4, 'Rabos Fritos', 12.00, true), (4, 'Nachos con Guacamole', 9.00, true), (4, 'Ensalada César', 8.00, true), (4, 'Sopa del Día', 6.50, true), (4, 'Bruschettas', 7.50, true),
-- Platos Principales (16)
(5, 'Bife de Chorizo', 18.00, true), (5, 'Ojo de Bife', 20.00, true), (5, 'Milanesa a Caballo', 14.00, true), (5, 'Milanesa Napolitana', 16.00, true), (5, 'Pechuga a la Plancha', 12.00, true), (5, 'Salmón Rosado', 22.00, true), (5, 'Ravioles de Espinaca', 13.00, true), (5, 'Ñoquis con Tuco', 11.00, true), (5, 'Hamburguesa Clásica', 10.00, true), (5, 'Hamburguesa Doble Queso', 13.00, true), (5, 'Pizza Margarita', 12.00, true), (5, 'Pizza Pepperoni', 14.00, true), (5, 'Risotto de Hongos', 15.00, true), (5, 'Wok de Vegetales', 11.00, true), (5, 'Tacos de Pollo', 12.50, true), (5, 'Costillas de Cerdo', 17.00, true),
-- Postres (6)
(6, 'Flan Mixto', 5.50, false), (6, 'Helado 2 Bochas', 4.50, false), (6, 'Tiramisú', 7.00, false), (6, 'Cheesecake', 7.50, false), (6, 'Volcán de Chocolate', 8.00, true), (6, 'Ensalada de Frutas', 4.00, false);

-- Algunos Ingredientes Básicos
INSERT INTO ingredients (name, unit_of_measure, current_stock) VALUES
('Carne de Res', 'Kg', 50.000),
('Pechuga de Pollo', 'Kg', 40.000),
('Papas', 'Kg', 100.000),
('Tomate', 'Kg', 30.000),
('Cebolla', 'Kg', 25.000),
('Queso Mozzarella', 'Kg', 20.000),
('Harina', 'Kg', 80.000),
('Aceite', 'Lt', 50.000);

-- Receta de Ejemplo: Hamburguesa Doble Queso (ID Producto: 38)
-- Usa 0.250 Kg de Carne, 0.100 Kg de Queso, 0.150 Kg de Papas (guarnición)
INSERT INTO recipes (product_id, ingredient_id, quantity) VALUES
(38, 1, 0.250), -- Carne
(38, 6, 0.100), -- Queso
(38, 3, 0.150); -- Papas Fritas

-- Huésped y Reserva de Prueba (Para testear cargos a habitación)
INSERT INTO guests (first_name, last_name, email, document_number) VALUES 
('Carlos', 'Sánchez', 'carlos.s@email.com', '12345678');

-- Reserva en In-House con un límite de crédito de $500.00
INSERT INTO reservations (guest_id, room_id, check_in_date, check_out_date, status, credit_limit) VALUES 
(1, 1, CURRENT_DATE, CURRENT_DATE + INTERVAL '3 days', 'In-House', 500.00);

-- Se abre el folio automáticamente para la reserva
INSERT INTO folios (reservation_id, status) VALUES (1, 'Abierto');

-- Cargo inicial de alojamiento en el folio
INSERT INTO folio_transactions (folio_id, transaction_type, description, amount) VALUES 
(1, 'Cargo', 'Alojamiento Noche 1', 80.00);
