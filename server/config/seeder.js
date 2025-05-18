const fs = require('fs');
const path = require('path');
const { sql, connectDB } = require('./database');

async function seedDatabase() {
    try {
        await connectDB();
        
        // SQL dosyasını oku
        const seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
        
        // Her bir SQL komutunu ayrı ayrı çalıştır
        const commands = seedSQL.split(';').filter(cmd => cmd.trim());
        
        for (const command of commands) {
            if (command.trim()) {
                await sql.query(command);
            }
        }
        
        console.log('Örnek veriler başarıyla eklendi!');
        process.exit(0);
    } catch (err) {
        console.error('Hata:', err);
        process.exit(1);
    }
}

seedDatabase();
