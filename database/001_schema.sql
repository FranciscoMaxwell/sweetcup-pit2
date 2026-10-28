PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (
 id TEXT PRIMARY KEY, name TEXT NOT NULL CHECK(length(name) BETWEEN 2 AND 80),
 address TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
 token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS products (
 id INTEGER PRIMARY KEY, name TEXT NOT NULL, price_cents INTEGER NOT NULL CHECK(price_cents > 0),
 description TEXT NOT NULL, image TEXT NOT NULL, category TEXT NOT NULL,
 rating REAL NOT NULL, reviews INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS ingredients (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS product_ingredients (
 product_id INTEGER NOT NULL REFERENCES products(id), ingredient_id INTEGER NOT NULL REFERENCES ingredients(id),
 position INTEGER NOT NULL CHECK(position >= 0), PRIMARY KEY(product_id,ingredient_id)
);
CREATE TABLE IF NOT EXISTS carts (
 user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 coupon TEXT NOT NULL DEFAULT '' CHECK(coupon IN ('','SWEET10','PROMO20')),
 version INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS cart_items (
 user_id TEXT NOT NULL REFERENCES carts(user_id) ON DELETE CASCADE,
 product_id INTEGER NOT NULL REFERENCES products(id), quantity INTEGER NOT NULL CHECK(quantity BETWEEN 1 AND 20),
 PRIMARY KEY(user_id,product_id)
);
CREATE TABLE IF NOT EXISTS favorites (
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 product_id INTEGER NOT NULL REFERENCES products(id), PRIMARY KEY(user_id,product_id)
);
CREATE TABLE IF NOT EXISTS orders (
 id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), request_key TEXT NOT NULL,
 created_at TEXT NOT NULL, status INTEGER NOT NULL DEFAULT 0 CHECK(status BETWEEN 0 AND 3),
 subtotal_cents INTEGER NOT NULL CHECK(subtotal_cents > 0), discount_cents INTEGER NOT NULL CHECK(discount_cents >= 0),
 delivery_cents INTEGER NOT NULL CHECK(delivery_cents >= 0), total_cents INTEGER NOT NULL CHECK(total_cents > 0),
 coupon TEXT NOT NULL, payment TEXT NOT NULL CHECK(payment IN ('pix','card','cash')),
 address TEXT NOT NULL, UNIQUE(user_id,request_key),
 CHECK(total_cents = subtotal_cents - discount_cents + delivery_cents)
);
CREATE TABLE IF NOT EXISTS order_items (
 order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
 product_id INTEGER NOT NULL REFERENCES products(id), product_name TEXT NOT NULL,
 price_cents INTEGER NOT NULL CHECK(price_cents > 0), quantity INTEGER NOT NULL CHECK(quantity BETWEEN 1 AND 20),
 PRIMARY KEY(order_id,product_id)
);
CREATE TABLE IF NOT EXISTS feedback (
 id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), tester_name TEXT NOT NULL,
 tested_at TEXT NOT NULL, worked TEXT NOT NULL, failed TEXT NOT NULL, untested TEXT NOT NULL,
 created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_orders_user_date ON orders(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);
