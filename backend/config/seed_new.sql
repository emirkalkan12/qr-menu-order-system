-- Kategorileri ekle
INSERT INTO Categories (Name) VALUES 
('Ana Yemekler'),
('Başlangıçlar'),
('Tatlılar'),
('İçecekler');

DECLARE @AnaYemeklerId int = (SELECT Id FROM Categories WHERE Name = 'Ana Yemekler');
DECLARE @BaslangiclarId int = (SELECT Id FROM Categories WHERE Name = 'Başlangıçlar');
DECLARE @TatlilarId int = (SELECT Id FROM Categories WHERE Name = 'Tatlılar');
DECLARE @IceceklerId int = (SELECT Id FROM Categories WHERE Name = 'İçecekler');

-- Menü öğelerini ekle
INSERT INTO MenuItems (Name, Description, Price, CategoryId, ImagePath, IsAvailable) VALUES 
('Klasik Burger', '180gr dana eti, özel sos, marul, domates, turşu', 120.00, @AnaYemeklerId, '/images/burger.jpg', 1),
('Tavuk Şiş', 'Marine edilmiş tavuk, közlenmiş sebze, pilav', 90.00, @AnaYemeklerId, '/images/tavuk-sis.jpg', 1),
('Mercimek Çorbası', 'Geleneksel kırmızı mercimek çorbası', 35.00, @BaslangiclarId, '/images/mercimek.jpg', 1),
('Künefe', 'Antep fıstıklı özel künefe', 75.00, @TatlilarId, '/images/kunefe.jpg', 1),
('Ayran', 'Ev yapımı ayran', 15.00, @IceceklerId, '/images/ayran.jpg', 1),
('Kola', 'Soğuk kola', 20.00, @IceceklerId, '/images/kola.jpg', 1);
