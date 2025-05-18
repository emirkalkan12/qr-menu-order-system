-- Önce mevcut verileri temizleyelim
DELETE FROM MenuItems;
DELETE FROM Categories;

-- Kategorileri ekle ve ID'lerini değişkenlerde saklayalım
INSERT INTO Categories (Name) VALUES (N'Ana Yemekler');
DECLARE @AnaYemeklerId int = SCOPE_IDENTITY();

INSERT INTO Categories (Name) VALUES (N'Başlangıçlar');
DECLARE @BaslangiclarId int = SCOPE_IDENTITY();

INSERT INTO Categories (Name) VALUES (N'Tatlılar');
DECLARE @TatlilarId int = SCOPE_IDENTITY();

INSERT INTO Categories (Name) VALUES (N'İçecekler');
DECLARE @IceceklerId int = SCOPE_IDENTITY();

-- Menü öğelerini ekle
INSERT INTO MenuItems (Name, Description, Price, CategoryId, ImagePath, IsAvailable) VALUES 
-- Ana Yemekler
(N'Klasik Burger', N'180gr dana eti, özel sos, marul, domates, turşu', 120.00, @AnaYemeklerId, '/images/burger.jpg', 1),
(N'Tavuk Şiş', N'Marine edilmiş tavuk, közlenmiş sebze, pilav', 90.00, @AnaYemeklerId, '/images/tavuk-sis.jpg', 1),
(N'Izgara Köfte', N'El yapımı köfte, pilav, közlenmiş biber', 95.00, @AnaYemeklerId, '/images/kofte.jpg', 1),
(N'Pide Karışık', N'Kuşbaşı et, kaşar peyniri, domates, biber', 85.00, @AnaYemeklerId, '/images/pide.jpg', 1),
(N'Mantı', N'El açması mantı, yoğurt, nane', 75.00, @AnaYemeklerId, '/images/manti.jpg', 1),

-- Başlangıçlar
(N'Mercimek Çorbası', N'Geleneksel kırmızı mercimek çorbası', 35.00, @BaslangiclarId, '/images/mercimek.jpg', 1),
(N'Humus', N'Nohut püresi, tahin, zeytinyağı', 45.00, @BaslangiclarId, '/images/humus.jpg', 1),
(N'Sigara Böreği', N'El açması yufka, beyaz peynir, maydanoz (6 adet)', 55.00, @BaslangiclarId, '/images/sigara-boregi.jpg', 1),
(N'Kalamar Tava', N'Çıtır kalamar, tartar sos', 85.00, @BaslangiclarId, '/images/kalamar.jpg', 1),
(N'Çoban Salata', N'Domates, salatalık, biber, soğan', 40.00, @BaslangiclarId, '/images/coban-salata.jpg', 1),

-- Tatlılar
(N'Künefe', N'Antep fıstıklı özel künefe', 75.00, @TatlilarId, '/images/kunefe.jpg', 1),
(N'Sütlaç', N'Fırında pişmiş geleneksel sütlaç', 45.00, @TatlilarId, '/images/sutlac.jpg', 1),
(N'Baklava', N'Antep fıstıklı baklava (4 dilim)', 85.00, @TatlilarId, '/images/baklava.jpg', 1),
(N'Dondurma', N'Karışık dondurma (3 top)', 40.00, @TatlilarId, '/images/dondurma.jpg', 1),
(N'Profiterol', N'Çikolata soslu profiterol', 55.00, @TatlilarId, '/images/profiterol.jpg', 1),

-- İçecekler
(N'Ayran', N'Ev yapımı ayran', 15.00, @IceceklerId, '/images/ayran.jpg', 1),
(N'Kola', N'Soğuk kola', 20.00, @IceceklerId, '/images/kola.jpg', 1),
(N'Türk Kahvesi', N'Geleneksel Türk kahvesi', 25.00, @IceceklerId, '/images/turk-kahvesi.jpg', 1),
(N'Limonata', N'Ev yapımı limonata', 22.00, @IceceklerId, '/images/limonata.jpg', 1),
(N'Çay', N'Taze demleme çay', 10.00, @IceceklerId, '/images/cay.jpg', 1),
(N'Şalgam', N'Acılı/Acısız şalgam suyu', 15.00, @IceceklerId, '/images/salgam.jpg', 1),
(N'Meyve Suyu', N'Portakal, elma, vişne, şeftali', 18.00, @IceceklerId, '/images/meyve-suyu.jpg', 1);
