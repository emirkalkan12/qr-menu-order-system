-- Kategorileri ekle
INSERT INTO Categories (Name) VALUES 
('Ana Yemekler'),
('Başlangıçlar'),
('Tatlılar'),
('İçecekler');

-- Menü öğelerini ekle
INSERT INTO MenuItems (Name, Description, Price, Category, ImagePath) VALUES 
('Klasik Burger', '180gr dana eti, özel sos, marul, domates, turşu', 120.00, 'Ana Yemekler', '/images/burger.jpg'),
('Tavuk Şiş', 'Marine edilmiş tavuk, közlenmiş sebze, pilav', 90.00, 'Ana Yemekler', '/images/tavuk-sis.jpg'),
('Mercimek Çorbası', 'Geleneksel kırmızı mercimek çorbası', 35.00, 'Başlangıçlar', '/images/mercimek.jpg'),
('Künefe', 'Antep fıstıklı özel künefe', 75.00, 'Tatlılar', '/images/kunefe.jpg'),
('Ayran', 'Ev yapımı ayran', 15.00, 'İçecekler', '/images/ayran.jpg'),
('Kola', 'Soğuk kola', 20.00, 'İçecekler', '/images/kola.jpg');

-- Örnek siparişler ekle
INSERT INTO Orders (TableNumber, Status, TotalAmount, CreatedAt) VALUES 
(1, 'beklemede', 225.00, GETDATE()),
(2, 'hazırlanıyor', 165.00, GETDATE());

-- Birinci siparişin detayları
INSERT INTO OrderItems (OrderId, MenuItemId, Name, Quantity, Price) VALUES 
(1, 1, 'Klasik Burger', 1, 120.00),
(1, 5, 'Ayran', 2, 15.00),
(1, 3, 'Mercimek Çorbası', 2, 35.00);

-- İkinci siparişin detayları
INSERT INTO OrderItems (OrderId, MenuItemId, Name, Quantity, Price) VALUES 
(2, 2, 'Tavuk Şiş', 1, 90.00),
(2, 4, 'Künefe', 1, 75.00);
