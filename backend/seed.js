const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const products = [
      {
        partName: 'Ламела BLUE PRINT Honda Civic 6',
        partNumber: 'ADH23129',
        price: 4870.4,
        supplier: 'Autocentar',
        productUrl: 'https://www.autocentar.mk/ламела-blue-print-honda-civic-6-hatchback-ejek-1.4-lpg-adh23129-g30880c112-i27711706.html',
        affiliateUrl: 'https://www.autocentar.mk/ламела-blue-print-honda-civic-6-hatchback-ejek-1.4-lpg-adh23129-g30880c112-i27711706.html',
        availability: 'Во залиха',
        description: 'Ламела BLUE PRINT за Honda Civic 6 Hatchback 1.4 LPG'
      },
      {
        partName: 'Кочници VW Bora',
        partNumber: 'BP-001',
        price: 2400,
        supplier: 'Autocentar',
        productUrl: 'https://www.autocentar.mk/%D0%B4%D0%B8%D1%81%D0%BA-%D0%BA%D0%BE%D1%87%D0%BD%D0%B8%D1%86%D0%B8-vw-bora-sedan-1j2-1.4-16v-d19260c2.html',
        affiliateUrl: 'https://www.autocentar.mk/%D0%B4%D0%B8%D1%81%D0%BA-%D0%BA%D0%BE%D1%87%D0%BD%D0%B8%D1%86%D0%B8-vw-bora-sedan-1j2-1.4-16v-d19260c2.html',
        availability: '2-3 дена',
        description: 'Кочници VW Bora'
      },
      {
        partName: 'Филтер за масло, BMW 3 Sedan/Coupe(E21) 316',
        partNumber: 'OF-001',
        price: 350,
        supplier: 'Autocentar',
        productUrl: 'https://www.autocentar.mk/%D1%84%D0%B8%D0%BB%D1%82%D0%B5%D1%80-%D0%B7%D0%B0-%D0%BC%D0%B0%D1%81%D0%BB%D0%BE-bmw-3-sedancoupe-e21-316-d43940c74.html',
        affiliateUrl: 'https://www.autocentar.mk/%D1%84%D0%B8%D0%BB%D1%82%D0%B5%D1%80-%D0%B7%D0%B0-%D0%BC%D0%B0%D1%81%D0%BB%D0%BE-bmw-3-sedancoupe-e21-316-d43940c74.html',
        availability: 'Во залиха',
        description: 'Филтер за масло, BMW 3 Sedan/Coupe(E21) 316'
      }
    ];

    await Product.deleteMany({ supplier: 'Autocentar' });
    const inserted = await Product.insertMany(products);
    console.log(`Seeded ${inserted.length} products`);

  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
