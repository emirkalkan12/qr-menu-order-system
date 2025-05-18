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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Category entity configuration
            modelBuilder.Entity<Category>()
                .Property(c => c.Name)
                .HasColumnType("nvarchar(100)");

            // MenuItem entity configuration
            modelBuilder.Entity<MenuItem>()
                .Property(m => m.Name)
                .HasColumnType("nvarchar(100)");

            modelBuilder.Entity<MenuItem>()
                .Property(m => m.Description)
                .HasColumnType("nvarchar(500)");

            base.OnModelCreating(modelBuilder);
        }
    }
}
