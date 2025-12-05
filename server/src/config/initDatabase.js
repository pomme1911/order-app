const { pool } = require('./database');

/**
 * 데이터베이스 초기화 스크립트
 * 테이블 생성 및 초기 데이터 삽입
 */

const createTables = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Menus 테이블 생성
    await client.query(`
      CREATE TABLE IF NOT EXISTS menus (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        price INTEGER NOT NULL CHECK (price > 0),
        image_url TEXT,
        stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
        quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
        category VARCHAR(50),
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // category와 is_available에 인덱스 생성
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_menus_category ON menus(category);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_menus_is_available ON menus(is_available);
    `);

    // Options 테이블 생성
    await client.query(`
      CREATE TABLE IF NOT EXISTS options (
        id SERIAL PRIMARY KEY,
        menu_id INTEGER NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
        option_name VARCHAR(50) NOT NULL,
        option_type VARCHAR(20) NOT NULL CHECK (option_type IN ('size', 'temperature')),
        option_price INTEGER NOT NULL DEFAULT 0 CHECK (option_price >= 0),
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // menu_id와 option_type에 복합 인덱스 생성
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_options_menu_type ON options(menu_id, option_type);
    `);

    // Orders 테이블 생성
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        order_items JSONB NOT NULL,
        total_amount INTEGER NOT NULL CHECK (total_amount > 0),
        total_quantity INTEGER NOT NULL CHECK (total_quantity > 0),
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // status와 order_date에 인덱스 생성
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date DESC);
    `);

    // updated_at 자동 업데이트 트리거 함수 생성
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // 각 테이블에 트리거 적용
    await client.query(`
      DROP TRIGGER IF EXISTS update_menus_updated_at ON menus;
      CREATE TRIGGER update_menus_updated_at
        BEFORE UPDATE ON menus
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_options_updated_at ON options;
      CREATE TRIGGER update_options_updated_at
        BEFORE UPDATE ON options
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
      CREATE TRIGGER update_orders_updated_at
        BEFORE UPDATE ON orders
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query('COMMIT');
    console.log('✅ 데이터베이스 테이블이 성공적으로 생성되었습니다.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ 테이블 생성 중 에러 발생:', error);
    throw error;
  } finally {
    client.release();
  }
};

const insertSampleData = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 샘플 메뉴 데이터 삽입
    const menuData = [
      { name: '아메리카노', description: '깊고 진한 에스프레소', price: 4000, category: 'espresso', stock: 50, quantity: 50, image_file: 'americano.jpg' },
      { name: '카페라떼', description: '부드러운 우유와 에스프레소', price: 4500, category: 'latte', stock: 40, quantity: 40, image_file: 'caffe_latte.jpg' },
      { name: '카푸치노', description: '풍부한 거품의 커피', price: 4500, category: 'latte', stock: 35, quantity: 35, image_file: 'cappuccino.jpg' },
      { name: '바닐라라떼', description: '달콤한 바닐라 향', price: 5000, category: 'latte', stock: 30, quantity: 30, image_file: 'vanilla_latte.jpg' },
      { name: '카라멜마끼아또', description: '카라멜의 달콤함', price: 5500, category: 'latte', stock: 25, quantity: 25, image_file: 'caramel_macchiato.jpg' },
      { name: '모카', description: '초콜릿과 커피의 조화', price: 5000, category: 'latte', stock: 20, quantity: 20, image_file: 'caffe_mocha.jpg' },
    ];

    for (const menu of menuData) {
      const result = await client.query(
        `INSERT INTO menus (name, description, price, category, stock, quantity, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (name) DO UPDATE SET 
           image_url = EXCLUDED.image_url,
           description = EXCLUDED.description,
           price = EXCLUDED.price,
           category = EXCLUDED.category,
           updated_at = CURRENT_TIMESTAMP
         RETURNING id`,
        [menu.name, menu.description, menu.price, menu.category, menu.stock, menu.quantity, `/images/${menu.image_file}`]
      );

      if (result.rows.length > 0) {
        const menuId = result.rows[0].id;

        // 각 메뉴에 사이즈 옵션 추가
        await client.query(
          `INSERT INTO options (menu_id, option_name, option_type, option_price, is_default)
           VALUES 
             ($1, 'Small', 'size', 0, true),
             ($1, 'Medium', 'size', 500, false),
             ($1, 'Large', 'size', 1000, false)
           ON CONFLICT DO NOTHING`,
          [menuId]
        );

        // 각 메뉴에 온도 옵션 추가
        await client.query(
          `INSERT INTO options (menu_id, option_name, option_type, option_price, is_default)
           VALUES 
             ($1, 'Hot', 'temperature', 0, true),
             ($1, 'Iced', 'temperature', 0, false)
           ON CONFLICT DO NOTHING`,
          [menuId]
        );
      }
    }

    await client.query('COMMIT');
    console.log('✅ 샘플 데이터가 성공적으로 삽입되었습니다.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ 샘플 데이터 삽입 중 에러 발생:', error);
    throw error;
  } finally {
    client.release();
  }
};

const initDatabase = async () => {
  try {
    console.log('🚀 데이터베이스 초기화를 시작합니다...');
    await createTables();
    await insertSampleData();
    console.log('🎉 데이터베이스 초기화가 완료되었습니다!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 데이터베이스 초기화 실패:', error);
    process.exit(1);
  }
};

// 스크립트로 직접 실행될 때만 초기화 실행
if (require.main === module) {
  initDatabase();
}

module.exports = { createTables, insertSampleData };
