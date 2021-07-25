using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TechWorld.BackendServer.Data.Entities.Contents;
using TechWorld.BackendServer.Data.Entities.Systems;

namespace TechWorld.BackendServer.Data
{
    public class DbInitializer
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly string AdminRoleName = "Admin";
        private readonly string UserRoleName = "Member";
        public DbInitializer(ApplicationDbContext context,
          UserManager<User> userManager,
          RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task Seed()
        {
            #region Systems
            if (!_roleManager.Roles.Any())
            {
                await _roleManager.CreateAsync(new IdentityRole
                {
                    Id = AdminRoleName,
                    Name = AdminRoleName,
                    NormalizedName = AdminRoleName.ToUpper(),
                });
                await _roleManager.CreateAsync(new IdentityRole
                {
                    Id = UserRoleName,
                    Name = UserRoleName,
                    NormalizedName = UserRoleName.ToUpper(),
                });
            }
            if (!_userManager.Users.Any())
            {
                var result = await _userManager.CreateAsync(new User()
                {
                    Id = Guid.NewGuid().ToString(),
                    UserName = "admin",
                    FirstName = "Quản trị",
                    LastName = "1",
                    Email = "khanglt1701@gmail.com",
                    LockoutEnabled = false
                }, "Admin@123");
                if (result.Succeeded)
                {
                    var user = await _userManager.FindByNameAsync("admin");
                    await _userManager.AddToRoleAsync(user, AdminRoleName);
                }
            }

            if (!_context.Functions.Any())
            {
                _context.Functions.AddRange(new List<Function>
                {
                    new Function {Id = "DASHBOARD", Name = "Thống kê", ParentId = null, SortOrder = 1,Url = "/dashboard",Icon="fa-dashboard" },

                    new Function {Id = "CONTENT",Name = "Nội dung",ParentId = null,Url = "/contents",Icon="fa-table" },

                    new Function {Id = "CONTENT_CATEGORY",Name = "Danh mục",ParentId ="CONTENT",Url = "/contents/categories"  },
                    new Function {Id = "CONTENT_PRODUCT",Name = "Sản phẩm",ParentId = "CONTENT",SortOrder = 2,Url = "/content/products",Icon="fa-edit" },
                    new Function {Id = "CONTENT_COMMENT",Name = "Trang",ParentId = "CONTENT",SortOrder = 3,Url = "/contents/comments",Icon="fa-edit" },
                    new Function {Id = "CONTENT_REPORT",Name = "Báo xấu",ParentId = "CONTENT",SortOrder = 3,Url = "/contents/reports",Icon="fa-edit" },

                    new Function {Id = "STATISTIC",Name = "Thống kê", ParentId = null, Url = "/statistics",Icon="fa-bar-chart-o" },

                    new Function {Id = "STATISTIC_MONTHLY_NEWMEMBER",Name = "Đăng ký từng tháng",ParentId = "STATISTIC",SortOrder = 1,Url = "/statistics/monthly-registers",Icon = "fa-wrench"},
                    new Function {Id = "STATISTIC_MONTHLY_NEWKB",Name = "Bài đăng hàng tháng",ParentId = "STATISTIC",SortOrder = 2,Url = "/statistics/monthly-newkbs",Icon = "fa-wrench"},
                    new Function {Id = "STATISTIC_MONTHLY_COMMENT",Name = "Comment theo tháng",ParentId = "STATISTIC",SortOrder = 3,Url = "/statistics/monthly-comments",Icon = "fa-wrench" },

                    new Function {Id = "SYSTEM", Name = "Hệ thống", ParentId = null, Url = "/systems",Icon="fa-th-list" },

                    new Function {Id = "SYSTEM_USER", Name = "Người dùng",ParentId = "SYSTEM",Url = "/system/users",Icon="fa-desktop"},
                    new Function {Id = "SYSTEM_ROLE", Name = "Nhóm quyền",ParentId = "SYSTEM",Url = "/system/roles",Icon="fa-desktop"},
                    new Function {Id = "SYSTEM_FUNCTION", Name = "Chức năng",ParentId = "SYSTEM",Url = "/system/functions",Icon="fa-desktop"},
                    new Function {Id = "SYSTEM_PERMISSION", Name = "Quyền hạn",ParentId = "SYSTEM",Url = "/system/permissions",Icon="fa-desktop"},
                });
                await _context.SaveChangesAsync();
            }

            if (!_context.Commands.Any())
            {
                _context.Commands.AddRange(new List<Command>()
                {
                    new Command(){Id = "VIEW", Name = "Xem"},
                    new Command(){Id = "CREATE", Name = "Thêm"},
                    new Command(){Id = "UPDATE", Name = "Sửa"},
                    new Command(){Id = "DELETE", Name = "Xoá"},
                    new Command(){Id = "IMPORT", Name = "Nhập"},
                    new Command(){Id = "EXPORT", Name = "Xuất"},
                    new Command(){Id = "APPROVE", Name = "Duyệt"},
                });
            }

            var functions = _context.Functions;
            if (!_context.CommandFunctions.Any())
            {
                foreach (var function in functions)
                {
                    var createAction = new CommandFunction()
                    {
                        CommandId = "CREATE",
                        FunctionId = function.Id
                    };
                    _context.CommandFunctions.Add(createAction);

                    var viewAction = new CommandFunction()
                    {
                        CommandId = "VIEW",
                        FunctionId = function.Id
                    };
                    _context.CommandFunctions.Add(viewAction);

                    var deleteAction = new CommandFunction()
                    {
                        CommandId = "DELETE",
                        FunctionId = function.Id
                    };
                    _context.CommandFunctions.Add(deleteAction);

                    var updateAction = new CommandFunction()
                    {
                        CommandId = "UPDATE",
                        FunctionId = function.Id
                    };
                    _context.CommandFunctions.Add(updateAction);

                    var importAction = new CommandFunction()
                    {
                        CommandId = "IMPORT",
                        FunctionId = function.Id
                    };
                    _context.CommandFunctions.Add(importAction);

                    var exportAction = new CommandFunction()
                    {
                        CommandId = "EXPORT",
                        FunctionId = function.Id
                    };
                    _context.CommandFunctions.Add(exportAction);

                    var approveAction = new CommandFunction()
                    {
                        CommandId = "APPROVE",
                        FunctionId = function.Id
                    };
                    _context.CommandFunctions.Add(approveAction);
                }
            }

            if (!_context.Permissions.Any())
            {
                var role = await _roleManager.FindByNameAsync(AdminRoleName);
                foreach (var function in functions)
                {
                    _context.Permissions.Add(new Permission() { CommandId = "CREATE", RoleId = role.Id, FunctionId = function.Id });
                    _context.Permissions.Add(new Permission() { CommandId = "UPDATE", RoleId = role.Id, FunctionId = function.Id });
                    _context.Permissions.Add(new Permission() {CommandId = "DELETE", RoleId = role.Id, FunctionId = function.Id });
                    _context.Permissions.Add(new Permission() { CommandId = "VIEW", RoleId = role.Id, FunctionId = function.Id });
                    _context.Permissions.Add(new Permission() { CommandId = "IMPORT", RoleId = role.Id, FunctionId = function.Id });
                    _context.Permissions.Add(new Permission() { CommandId = "EXPORT", RoleId = role.Id, FunctionId = function.Id });
                    _context.Permissions.Add(new Permission() { CommandId = "APPROVE", RoleId = role.Id, FunctionId = function.Id });
                }
            }
            await _context.SaveChangesAsync();
            #endregion

            #region Content
            if (!_context.Categories.Any())
            {
                var categories = new List<Category>
                {
                    new Category(){Name = "Điện thoại", ParentId = null, SeoAlias = "dien-thoai", SeoDecription="điện thoại", SeoKeyword="dien-thoai", SeoTitle = "Điện thoại", SortOrder=1},
                    new Category(){Name = "Laptop", ParentId = null, SeoAlias = "laptop", SeoDecription="Laptop", SeoKeyword="laptop", SeoTitle = "Laptop", SortOrder=2},
                    new Category(){Name = "Đồng hồ", ParentId = null, SeoAlias = "dien-thoai", SeoDecription="Đồng hồ", SeoKeyword="dien-thoai", SeoTitle = "Đồng hồ", SortOrder=3},
                    new Category(){Name = "Phụ kiện", ParentId = null, SeoAlias = "dien-thoai", SeoDecription="Phụ kiện", SeoKeyword="dien-thoai", SeoTitle = "Phụ kiện", SortOrder=4},
                    new Category(){Name = "Sim & thẻ", ParentId = null, SeoAlias = "dien-thoai", SeoDecription="Sim & thẻ", SeoKeyword="dien-thoai", SeoTitle = "Sim & thẻ", SortOrder=5}
                };
                await _context.AddRangeAsync(categories);
            }
            await _context.SaveChangesAsync();

            if (!_context.Brands.Any())
            {
                var categories = new List<Brand>
                {
                    new Brand(){Name = "Apple", CategoryId = 1},
                    new Brand(){Name = "Samsung", CategoryId = 1},
                    new Brand(){Name = "Xiaomi", CategoryId = 1},
                    new Brand(){Name = "Oppo", CategoryId = 1},
                    new Brand(){Name = "Vivo", CategoryId = 1},
                    new Brand(){Name = "Realme", CategoryId = 1},
                    new Brand(){Name = "Nokia", CategoryId = 1},
                    new Brand(){Name = "Vsmart", CategoryId = 1},
                    new Brand(){Name = "Masstel", CategoryId = 1},
                    new Brand(){Name = "Apple", CategoryId = 2},
                    new Brand(){Name = "Asus", CategoryId = 2},
                    new Brand(){Name = "Dell", CategoryId = 2},
                    new Brand(){Name = "Acer", CategoryId =  2},
                    new Brand(){Name = "HP", CategoryId = 2},
                    new Brand(){Name = "Lenovo", CategoryId = 2},
                    new Brand(){Name = "Microsoft", CategoryId = 2},
                    new Brand(){Name = "MSI", CategoryId = 2},
                    new Brand(){Name = "Avita", CategoryId = 2},
                };
                await _context.AddRangeAsync(categories);
            }
            await _context.SaveChangesAsync();

            if (!_context.Products.Any())
            {
                var products = new List<Product>
                {
                    new Product(){Name = "MacBook Pro 16\" 2019 Touch Bar 2.3GHz Core i9 1TB", Description = null, Content = null, OriginalPrice = 69990000, Price = 69990000, PromotionPrice = 69990000,Quantity = 10, ImageUrl = null, ImageList = null, ViewCount = 1, SeoAlias = "MacBook-Pro-16\"-2019-Touch-Bar-2.3GHz-Core-i9-1TB", SeoTitle = "MacBook Pro 16 Touch Bar 2.3GHz Core i9, trả góp 0% | Fptshop.com.vn", SeoKeyword = "MacBook Pro 16\" 2019 Touch Bar 2.3GHz Core i9 1TB", SeoDecription = "Mua MacBook Pro 16 Touch Bar 2.3GHz Core i9 chính hãng mạnh mẽ, phá vỡ mọi giới hạn đã xuất hiện, bảo hành 1 năm, thủ tục xét duyệt trả góp nhanh, giao hành trong 1h", CreatedDate = DateTime.Now,RateCount = 1, RateTotal = 1, BrandId = 10},
                    new Product(){Name = "MacBook Pro 16\" 2019 Touch Bar 2.6GHz Core i7 512GB", Description = null, Content = null, OriginalPrice = 59990000, Price = 59990000, PromotionPrice = 59990000,Quantity = 20, ImageUrl = null, ImageList = null, ViewCount = 1, SeoAlias = "MacBook-Pro-16\"-2019-Touch-Bar-2.3GHz-Core-i9-1TB", SeoTitle = "MacBook Pro 16 Touch Bar 2.6GHz Core i7 trả góp 0% | Fptshop.com.vn", SeoKeyword = "MacBook Pro 16\" 2019 Touch Bar 2.6GHz Core i7 512GB", SeoDecription = "MacBook Pro 16 Touch Bar 2.6GHz Core i7 là chiếc MacBook có màn hình lớn nhất từ trước đến nay, hỗ trợ trả góp 0% xét duyệt nhanh, giao hàng trong 1h", CreatedDate = DateTime.Now,RateCount = 1, RateTotal = 1, BrandId = 10},
                    new Product(){Name = "MacBook Pro 13\" 2020 Touch Bar 2.0GHz Core i5 512GB", Description = null, Content = null, OriginalPrice = 47990000, Price = 47990000, PromotionPrice = 47990000,Quantity = 15, ImageUrl = null, ImageList = null, ViewCount = 1, SeoAlias = "MacBook-Pro-16\"-2019-Touch-Bar-2.3GHz-Core-i9-1TB", SeoTitle = "MacBook Pro 13\" 2020 Core i5 512GB chính hãng, trả góp 0% | Fptshop.com.vn", SeoKeyword = "MacBook Pro 13\" 2020 Touch Bar 2.0GHz Core i5 512GB", SeoDecription = "Mua Apple MacBook Pro 13\" 2020 Touch Bar 2.0GHz Core i5 512GB, hỗ trợ trả góp 0%, trả trước 0đ, bảo hành chính hãng 1 năm, miễn phí giao hàng trong 1h", CreatedDate = DateTime.Now,RateCount = 1, RateTotal = 1, BrandId = 10},
                    new Product(){Name = "MacBook Pro 13\" 2020 Touch Bar 2.0GHz Core i5 1TB", Description = null, Content = null, OriginalPrice = 54790000, Price = 54790000, PromotionPrice = 54790000,Quantity = 30, ImageUrl = null, ImageList = null, ViewCount = 1, SeoAlias = "MacBook-Pro-16\"-2019-Touch-Bar-2.3GHz-Core-i9-1TB", SeoTitle = "MacBook Pro 13\" 2020 Core i5 1TB chính hãng, trả góp 0% | Fptshop.com.vn", SeoKeyword = "MacBook Pro 13\" 2020 Touch Bar 2.0GHz Core i5 1TB", SeoDecription = "Mua Apple MacBook Pro 13\" 2020 Touch Bar 2.0GHz Core i5 512GB, hỗ trợ trả góp 0%, trả trước 0đ, bảo hành chính hãng 1 năm, miễn phí giao hàng trong 1h", CreatedDate = DateTime.Now,RateCount = 1, RateTotal = 1, BrandId = 1},
                    new Product(){Name = "Laptop ASUS Gaming TUF FX516PE i7 mượt mà - mạnh mẽ | Fptshop.com.vn", Description = null, Content = null, OriginalPrice = 54790000, Price = 54790000, PromotionPrice = 54790000,Quantity = 30, ImageUrl = null, ImageList = null, ViewCount = 1, SeoAlias = "MacBook-Pro-16\"-2019-Touch-Bar-2.3GHz-Core-i9-1TB", SeoTitle = "MacBook Pro 13\" 2020 Core i5 1TB chính hãng, trả góp 0% | Fptshop.com.vn", SeoKeyword = "Laptop ASUS Gaming TUF FX516PE HN005T i7 11370H/8GB/512GB SSD/RTX3050Ti_4GB/Win10", SeoDecription = "Mua laptop ASUS Gaming TUF FX516PE trang bị core i7 thế hệ 11 mạnh mẽ, card đồ họa RTX 30 series cho trải nghiệm game mượt mà, hỗ trợ trả góp duyệt nhanh, tặng balo laptop xịn 400.000đ", CreatedDate = DateTime.Now,RateCount = 1, RateTotal = 1, BrandId = 11},
                    
                };
                await _context.AddRangeAsync(products);
            }
            await _context.SaveChangesAsync();
            #endregion
        }
    }
}
