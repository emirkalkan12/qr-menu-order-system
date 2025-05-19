using Microsoft.EntityFrameworkCore;
using QRMenuAPI;
using QRMenuAPI.Models;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddDbContext<QRMenuDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS politikasını ekle
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

// Veritabanını başlat ve seed verilerini yükle
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<QRMenuDbContext>();
        context.Database.EnsureCreated();

        // Seed SQL dosyasını oku ve çalıştır
        var seedSqlPath = Path.Combine(AppContext.BaseDirectory, "config", "seed_clean.sql");
        if (File.Exists(seedSqlPath))
        {
            var seedSql = File.ReadAllText(seedSqlPath);
            context.Database.ExecuteSqlRaw(seedSql);
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Veritabanı başlatılırken bir hata oluştu.");
    }
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// wwwroot klasöründen statik dosya sunumu
app.UseStaticFiles();

// Karakter kodlaması için middleware
app.Use(async (context, next) =>
{
    context.Response.Headers["Content-Type"] = "application/json; charset=utf-8";
    await next();
});

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthorization();
app.UseCors("AllowAll");
app.MapControllers();

app.Run();
