using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using TechWorld.BackendServer.Data.Entities.Contents;
using TechWorld.BackendServer.Data.Entities.Systems;

namespace TechWorld.BackendServer.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<OrderDetail>().HasKey(x => new { x.OrderId, x.ProductId });
            builder.Entity<ProductCategory>().HasKey(x => new { x.ProductId, x.CategoryId });
            builder.Entity<BrandCategory>().HasKey(x => new { x.BrandId, x.CategoryId });
            builder.Entity<ProductTag>().HasKey(x => new { x.ProductId, x.TagId });
            builder.Entity<Permission>().HasKey(x => new { x.FunctionId, x.CommandId, x.RoleId });
            builder.Entity<CommandFunction>().HasKey(x => new { x.FunctionId, x.CommandId });


            builder.HasSequence("TechWorldSequence");

            base.OnModelCreating(builder);
        }

        public DbSet<Announcement> Announcements { get; set; }

        public DbSet<Brand> Brands { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Function> Functions { get; set; }

        public DbSet<Order> Orders { get; set; }

        public DbSet<OrderDetail> OrderDetails { get; set; }

        public DbSet<PaymentMethod> PaymentMethods { get; set; }

        public DbSet<Product> Products { get; set; }

        public DbSet<ProductCategory> ProductCategories { get; set; }

        public DbSet<ProductTag> ProductTags { get; set; }

        public DbSet<Tag> Tags { get; set; }

        public DbSet<Command> Commands { get; set; }

        public DbSet<CommandFunction> CommandFunctions { get; set; }

        public DbSet<Permission> Permissions { get; set; }
    }
}