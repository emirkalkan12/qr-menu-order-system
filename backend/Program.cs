using Microsoft.EntityFrameworkCore;
using QRMenuAPI;
using QRMenuAPI.Models;

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
