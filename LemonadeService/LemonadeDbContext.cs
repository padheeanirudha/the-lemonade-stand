using Microsoft.EntityFrameworkCore;
using LemonadeService.Models;

namespace LemonadeService.Data
{
    public class LemonadeDbContext : DbContext
    {
        public LemonadeDbContext(DbContextOptions<LemonadeDbContext> options) : base(options) { }

        public DbSet<Product> Products => Set<Product>();
        public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed initial varieties matching requirements
            modelBuilder.Entity<Product>().HasData(
                new Product { Id = 1, Name = "Lemonade", Description = "Classic freshly squeezed lemonade" },
                new Product { Id = 2, Name = "Pink Lemonade", Description = "Sweet raspberry-infused pink lemonade" }
            );

            // Seed target dynamic pricing variations
            modelBuilder.Entity<ProductVariant>().HasData(
                new ProductVariant { Id = 1, ProductId = 1, SizeName = "Regular", Price = 1.00m },
                new ProductVariant { Id = 2, ProductId = 1, SizeName = "Large", Price = 1.50m },
                new ProductVariant { Id = 3, ProductId = 2, SizeName = "Regular", Price = 1.00m },
                new ProductVariant { Id = 4, ProductId = 2, SizeName = "Large", Price = 1.50m }
            );
        }
    }
}