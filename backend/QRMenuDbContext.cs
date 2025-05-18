using Microsoft.EntityFrameworkCore;
using QRMenuAPI.Models;

namespace QRMenuAPI
{
    public class QRMenuDbContext : DbContext
    {
        public QRMenuDbContext(DbContextOptions<QRMenuDbContext> options) : base(options) { }

        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
    }
}
