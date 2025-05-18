const sql = require('mssql');

const config = {
    user: 'sa',  // SQL Server kullanıcı adı
    password: '12345',  // SQL Server şifresi
    server: 'localhost\\SQLEXPRESS',  // SQL Server instance
    database: 'QRMenuDB',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

async function connectDB() {
    try {
        await sql.connect(config);
        console.log('SQL Server bağlantısı başarılı');
    } catch (err) {
        console.error('SQL Server bağlantı hatası:', err);
    }
}

module.exports = {
    sql,
    connectDB
};
