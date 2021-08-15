using Humanizer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.IO.Pipelines;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;
using TechWorld.BackendServer.Data.Entities.Contents;
using TechWorld.BackendServer.Data.Entities.Systems;
using TechWorld.ViewModels.Contents;
using Microsoft.AspNetCore;
using static System.Net.WebRequestMethods;

namespace TechWorld.BackendServer.Data
{
    public class DbInitializer
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly string AdminRoleName = "Admin";
        private readonly string UserRoleName = "Member";
        private readonly IHttpContextAccessor _httpContextAccessor;
        public DbInitializer(ApplicationDbContext context,
          UserManager<User> userManager,
          RoleManager<IdentityRole> roleManager,
          IHttpContextAccessor httpContextAccessor)

        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _httpContextAccessor = httpContextAccessor;
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
                    FullName = "Administrator",
                    Email = "khanglt1701@gmail.com",
                    DateCreated = DateTime.Now,
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

                    new Function {Id = "SYSTEM_USER", Name = "Tài khoản",ParentId = "SYSTEM",Url = "/system/users",Icon="fa-desktop"},
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
                    _context.Permissions.Add(new Permission() { CommandId = "DELETE", RoleId = role.Id, FunctionId = function.Id });
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
                    new Category(){Name = "Điện thoại", SeoAlias = "dien-thoai", SeoDescription="Điện thoại chính hãng iPhone, Samsung, Oppo, Sony, HTC, LG… ✓Mua Online giá rẻ ✓Bảo hành chính hãng ✓Giao hàng toàn quốc ✓Cho phép đổi trả ✓Trả góp nhanh, lãi suất thấp.", SeoKeyword="dien thoai, điện thoại di động, smartphone, mua điện thoại", SeoTitle = "Điện thoại, smartphone chính hãng, giá rẻ, trả góp nhanh", SortOrder=1},
                    new Category(){Name = "Laptop", SeoAlias = "laptop", SeoDescription="Mua laptop, máy tính giá rẻ chính hãng 100%, bảo hành hậu mãi chu đáo, trả góp 0%, miễn phí giao hàng 63 tỉnh, tặng balo laptop xịn 400.000đ!", SeoKeyword="Laptop, Máy tính xách tay, Laptop HP, Laptop Dell, Laptop Acer, laptop trả góp 0 đồng", SeoTitle = "Laptop | Máy tính xách tay chính hãng, trả góp 0% - FPT Shop", SortOrder=2},
                    new Category(){Name = "Đồng hồ", SeoAlias = "dong-ho", SeoDescription="Đồng hồ thông minh Apple Watch chính hãng, nhiều ưu đãi, quà tặng hấp dẫn, bảo hành chính hãng. Mua online ngay nhận quà liền tay giá tốt hơn.", SeoKeyword="apple watch, đồng hồ apple, đồng hồ thông minh Apple", SeoTitle = "Apple Watch | Đồng hồ thông minh trả góp ưu đãi", SortOrder=3},
                    new Category(){Name = "Phụ kiện", SeoAlias = "phu-kien", SeoDescription="Phụ kiện điện thoại, tablet, laptop chính hãng ✓Mua Online giá rẻ ✓Bảo hành chính hãng toàn quốc ✓Giao hàng nhanh ✓Cho phép đổi trả", SeoKeyword="Phụ kiện điện thoại, tablet, laptop", SeoTitle = "Phụ kiện điện thoại, tablet, laptop chính hãng, giá rẻ", SortOrder=4},
                    new Category(){Name = "Sim & thẻ", SeoAlias = "sim&the", SeoDescription="Kho Sim Số Đẹp, nạp thẻ cào, mua thẻ game, Sim 3G, 4G của Viettel, Mobifone, Vina, VietnamMobile, thẻ game Gate, Zing, Garena và các nhà cung cấp game trong và ngoài nước", SeoKeyword="điện thoại di dộng,máy tính bảng,dien thoai chinh hang,may tinh xach tay,laptop chinh hang,phu kien laptop,điện thoại,dien thoai di dong,may tinh bang", SeoTitle = "Kho Sim Số Đẹp, nạp thẻ cào, mua thẻ game, Sim 3G, 4G của Viettel, Mobifone, Vina, VietnamMobile, thẻ game Gate, Zing, Garena và các nhà cung cấp game trong và ngoài nước", SortOrder=5}
                };
                await _context.AddRangeAsync(categories);
            }
            await _context.SaveChangesAsync();

            if (!_context.Brands.Any())
            {
                var categories = new List<Brand>
                {
                    new Brand(){Name = "Apple", CategoryId = 5},
                    new Brand(){Name = "Samsung", CategoryId = 5},
                    new Brand(){Name = "Xiaomi", CategoryId = 5},
                    new Brand(){Name = "Oppo", CategoryId = 5},
                    new Brand(){Name = "Vivo", CategoryId = 5},
                    new Brand(){Name = "Realme", CategoryId = 5},
                    new Brand(){Name = "Nokia", CategoryId = 5},
                    new Brand(){Name = "Vsmart", CategoryId = 5},
                    new Brand(){Name = "Masstel", CategoryId = 5},

                    new Brand(){Name = "Apple", CategoryId = 4},
                    new Brand(){Name = "Asus", CategoryId = 4},
                    new Brand(){Name = "Dell", CategoryId = 4},
                    new Brand(){Name = "Acer", CategoryId =  4},
                    new Brand(){Name = "HP", CategoryId = 4},
                    new Brand(){Name = "Lenovo", CategoryId = 4},
                    new Brand(){Name = "Microsoft", CategoryId = 4},
                    new Brand(){Name = "MSI", CategoryId = 4},
                    new Brand(){Name = "Avita", CategoryId = 4},

                    new Brand(){Name = "Apple Watch", CategoryId = 3},
                    new Brand(){Name = "Samsung", CategoryId = 3},
                    new Brand(){Name = "Oppo", CategoryId = 3},
                    new Brand(){Name = "Masstel", CategoryId = 3},
                    new Brand(){Name = "Garmin", CategoryId = 3},
                    new Brand(){Name = "Xiaomi", CategoryId = 3},
                    new Brand(){Name = "Huawei", CategoryId = 3},

                    new Brand(){Name = "Phụ kiện Apple", CategoryId = 2},
                    new Brand(){Name = "Bao da ốp lưng", CategoryId = 2},
                    new Brand(){Name = "Sạc dự phòng", CategoryId = 2},
                    new Brand(){Name = "Thẻ nhớ", CategoryId = 2},
                    new Brand(){Name = "Miếng dán màn hình", CategoryId = 2},
                    new Brand(){Name = "Tai nghe", CategoryId = 2},
                    new Brand(){Name = "Loa", CategoryId = 2},
                    new Brand(){Name = "USB - Ổ cứng", CategoryId = 2},
                    new Brand(){Name = "Sạc cáp", CategoryId = 2},
                    new Brand(){Name = "Chuột", CategoryId = 2},
                    new Brand(){Name = "Bàn phím", CategoryId = 2},

                    new Brand(){Name = "Viettel", CategoryId = 1},
                    new Brand(){Name = "Vinaphone", CategoryId = 1},
                    new Brand(){Name = "Mobiphone", CategoryId = 1},
                    new Brand(){Name = "Vietnamobile", CategoryId = 1},

                };
                await _context.AddRangeAsync(categories);
            }
            await _context.SaveChangesAsync();

            if (!_context.BrandCategories.Any())
            {
                var brandCategories = new List<BrandCategory>()
                {
                    new BrandCategory(){BrandId = 1, CategoryId = 1},
                    new BrandCategory(){BrandId = 2, CategoryId = 1},
                    new BrandCategory(){BrandId = 3, CategoryId = 1},
                    new BrandCategory(){BrandId = 4, CategoryId = 1},

                    new BrandCategory(){BrandId = 5, CategoryId = 2},
                    new BrandCategory(){BrandId = 6, CategoryId = 2},
                    new BrandCategory(){BrandId = 7, CategoryId = 2},
                    new BrandCategory(){BrandId = 8, CategoryId = 2},
                    new BrandCategory(){BrandId = 9, CategoryId = 2},
                    new BrandCategory(){BrandId = 10, CategoryId = 2},
                    new BrandCategory(){BrandId = 11, CategoryId = 2},
                    new BrandCategory(){BrandId = 12, CategoryId = 2},
                    new BrandCategory(){BrandId = 13, CategoryId = 2},
                    new BrandCategory(){BrandId = 14, CategoryId = 2},
                    new BrandCategory(){BrandId = 15, CategoryId = 2},

                    new BrandCategory(){BrandId = 16, CategoryId = 3},
                    new BrandCategory(){BrandId = 17, CategoryId = 3},
                    new BrandCategory(){BrandId = 18, CategoryId = 3},
                    new BrandCategory(){BrandId = 19, CategoryId = 3},
                    new BrandCategory(){BrandId = 20, CategoryId = 3},
                    new BrandCategory(){BrandId = 21, CategoryId = 3},
                    new BrandCategory(){BrandId = 22, CategoryId = 3},

                    new BrandCategory(){BrandId = 23, CategoryId = 4},
                    new BrandCategory(){BrandId = 24, CategoryId = 4},
                    new BrandCategory(){BrandId = 25, CategoryId = 4},
                    new BrandCategory(){BrandId = 26, CategoryId = 4},
                    new BrandCategory(){BrandId = 27, CategoryId = 4},
                    new BrandCategory(){BrandId = 28, CategoryId = 4},
                    new BrandCategory(){BrandId = 29, CategoryId = 4},
                    new BrandCategory(){BrandId = 30, CategoryId = 4},
                    new BrandCategory(){BrandId = 31, CategoryId = 4},

                    new BrandCategory(){BrandId = 32, CategoryId = 5},
                    new BrandCategory(){BrandId = 33, CategoryId = 5},
                    new BrandCategory(){BrandId = 34, CategoryId = 5},
                    new BrandCategory(){BrandId = 35, CategoryId = 5},
                    new BrandCategory(){BrandId = 36, CategoryId = 5},
                    new BrandCategory(){BrandId = 37, CategoryId = 5},
                    new BrandCategory(){BrandId = 38, CategoryId = 5},
                    new BrandCategory(){BrandId = 39, CategoryId = 5},
                    new BrandCategory(){BrandId = 40, CategoryId = 5}
                };
                _context.BrandCategories.AddRange(brandCategories);
            }

            if (!_context.Products.Any())
            {
                var products = new List<Product>
                {
                    new Product(){Name = "MacBook Pro 16\" 2019 Touch Bar 2.3GHz Core i9 1TB", Description = null, Content = null, OriginalPrice = 69990000, Price = 69990000, PromotionPrice = 69990000,Quantity = 10, ViewCount = 1, SeoAlias = "MacBook-Pro-16\"-2019-Touch-Bar-2.3GHz-Core-i9-1TB", SeoTitle = "MacBook Pro 16 Touch Bar 2.3GHz Core i9, trả góp 0% | Fptshop.com.vn", SeoKeyword = "MacBook Pro 16\" 2019 Touch Bar 2.3GHz Core i9 1TB", SeoDescription = "Mua MacBook Pro 16 Touch Bar 2.3GHz Core i9 chính hãng mạnh mẽ, phá vỡ mọi giới hạn đã xuất hiện, bảo hành 1 năm, thủ tục xét duyệt trả góp nhanh, giao hành trong 1h", CreatedDate = DateTime.Now,RateCount = 1, RateTotal = 1, BrandId = 10, CategoryId = 4},
                    new Product(){Name = "MacBook Pro 16\" 2019 Touch Bar 2.6GHz Core i7 512GB", Description = null, Content = null, OriginalPrice = 59990000, Price = 59990000, PromotionPrice = 59990000,Quantity = 20, ViewCount = 1, SeoAlias = "MacBook-Pro-16\"-2019-Touch-Bar-2.3GHz-Core-i9-1TB", SeoTitle = "MacBook Pro 16 Touch Bar 2.6GHz Core i7 trả góp 0% | Fptshop.com.vn", SeoKeyword = "MacBook Pro 16\" 2019 Touch Bar 2.6GHz Core i7 512GB", SeoDescription = "MacBook Pro 16 Touch Bar 2.6GHz Core i7 là chiếc MacBook có màn hình lớn nhất từ trước đến nay, hỗ trợ trả góp 0% xét duyệt nhanh, giao hàng trong 1h", CreatedDate = DateTime.Now,RateCount = 1, RateTotal = 1, BrandId = 10, CategoryId = 4},
                    new Product(){Name = "MacBook Pro 13\" 2020 Touch Bar M1 512GB", Description = null, Content = null, OriginalPrice = 36999000, Price = 39999000, PromotionPrice = 37999000,Quantity = 15, ViewCount = 1, SeoAlias = "macbook-pro-13-2020-touch-bar-m1-512gb", SeoTitle = "MacBook Pro 13\" 2020 Core i5 512GB chính hãng, trả góp 0% | Fptshop.com.vn", SeoKeyword = "MacBook Pro 13\" 2020 Touch Bar 2.0GHz Core i5 512GB", SeoDescription = "Mua Apple MacBook Pro 13\" 2020 Touch Bar 2.0GHz Core i5 512GB, hỗ trợ trả góp 0%, trả trước 0đ, bảo hành chính hãng 1 năm, miễn phí giao hàng trong 1h", CreatedDate = DateTime.Now,RateCount = 1, RateTotal = 1, BrandId = 10, CategoryId = 4},
                    new Product(){Name = "MacBook Pro 13\" 2020 Touch Bar 2.0GHz Core i5 512GB", Description = null, Content = null, OriginalPrice = 43999000, Price = 47999000, PromotionPrice = 45999000,Quantity = 30, ViewCount = 1, SeoAlias = "macbook-pro-13-2020-2-0-ghz-i5-512gb", SeoTitle = "MacBook Pro 13", SeoKeyword = "MacBook Pro 13", SeoDescription = "Mua Apple MacBook Pro 13", CreatedDate = DateTime.Now,RateCount = 1, RateTotal = 1, BrandId = 1, CategoryId = 1},

                    new Product(){Name = "Laptop ASUS Gaming TUF FX516PE HN005T i7 11370H/8GB/512GB SSD/RTX 3050Ti_4GB/Win10", Description = null, Content = null, OriginalPrice = 25999000, Price = 29999000, PromotionPrice = 27999000,Quantity = 30, ViewCount = 1, SeoAlias = "asus-tuf-fx516pe-hn005t-i7-11370h", SeoTitle = "Laptop ASUS Gaming TUF FX516PE i7 mượt mà - mạnh mẽ | Fptshop.com.vn", SeoKeyword = "Laptop ASUS Gaming TUF FX516PE HN005T i7 11370H/8GB/512GB SSD/RTX 3050Ti_4GB/Win10", SeoDescription = "Mua laptop ASUS Gaming TUF FX516PE trang bị core i7 thế hệ 11 mạnh mẽ, card đồ họa RTX 30 series cho trải nghiệm game mượt mà, hỗ trợ trả góp duyệt nhanh, tặng balo laptop xịn 400.000đ", CreatedDate = DateTime.Now,RateCount = 1, RateTotal = 1, BrandId = 11, CategoryId = 4},
                    new Product(){Name = "Laptop Asus Zenbook UX425EA KI429T i5 1135G7/8GB/512GB SSD/Win 10", Description = "Mua laptop Asus Zenbook UX425EA KI429T i5 là một sự lựa chọn đúng đắn của bạn! Mỏng nhẹ 1,17kg, độ bền quân đội MIL-STD-810G, màn hình full HD đẹp tuyệt mỹ. XEM NGAY!", Content = null, OriginalPrice = 23699000, Price = 23699000, PromotionPrice = 23699000,Quantity = 30, ViewCount = 1, SeoAlias = "MacBook-Pro-16\"-2019-Touch-Bar-2.3GHz-Core-i9-1TB", SeoTitle = "MacBook Pro 13\" 2020 Core i5 1TB chính hãng, trả góp 0% | Fptshop.com.vn", SeoKeyword = "Laptop Asus Zenbook UX425EA KI429T i5 1135G7/8GB/512GB SSD/Win 10", SeoDescription = "Mua laptop Asus Zenbook UX425EA KI429T i5 là một sự lựa chọn đúng đắn của bạn! Mỏng nhẹ 1,17kg, độ bền quân đội MIL-STD-810G, màn hình full HD đẹp tuyệt mỹ. XEM NGAY!", CreatedDate = DateTime.Now,RateCount = 1, RateTotal = 1, BrandId = 11, CategoryId = 4},
                    new Product(){Name = "Laptop Asus TUF Gaming FX516PM HN023T i7 11370H/16GB/512GB SSD/RTX 3060_6GB/Win10", Description = "Mua laptop Asus Zenbook UX425EA KI429T i5 là một sự lựa chọn đúng đắn của bạn! Mỏng nhẹ 1,17kg, độ bền quân đội MIL-STD-810G, màn hình full HD đẹp tuyệt mỹ. XEM NGAY!", Content = null, OriginalPrice = 28999000, Price = 32999000, PromotionPrice = 30999000,Quantity = 30, ViewCount = 1, SeoAlias = "asus-tuf-gaming-fx516pm-hn023t-i7-11370h", SeoTitle = "Laptop Asus TUF Gaming FX516PM i7 đỉnh cao của gaming, cực chất! | Fptshop.com.vn", SeoKeyword = "Laptop Asus TUF Gaming FX516PM HN023T i7 11370H/16GB/512GB SSD/RTX 3060_6GB/Win10", SeoDescription = "Mua laptop Asus TUF Gaming FX516PM HN023T i7 đáp ứng mọi nhu cầu của bạn ✅ Cho bạn trải nghiệm chơi game chuyên nghiệp ✅ Hỗ trợ trả góp 0% duyệt nhanh ✅ Tặng balo laptop chất lượng ✅ Mua ngay!", CreatedDate = DateTime.Now,RateCount = 1, RateTotal = 1, BrandId = 11, CategoryId = 4},

                    new Product(){Name = "Dell G3 15 3500B i7 10750H/16GB/512GB/15.6\"FHD/NV GTX1660Ti 6GB/Win 10", Description = "Mua laptop Asus Zenbook UX425EA KI429T i5 là một sự lựa chọn đúng đắn của bạn! Mỏng nhẹ 1,17kg, độ bền quân đội MIL-STD-810G, màn hình full HD đẹp tuyệt mỹ. XEM NGAY!", Content = null, OriginalPrice = 28999000, Price = 32999000, PromotionPrice = 30999000,Quantity = 30, ViewCount = 1, SeoAlias = "dell-g3-15-3500b-i7-10750h", SeoTitle = "Laptop Dell G3 15 3500B i7 10750H chính hãng, trả góp 0% | Fptshop.com.vn", SeoKeyword = "Dell G3 15 3500B i7 10750H/16GB/512GB/15.6", SeoDescription = "Mua laptop Dell G3 15 3500B i7 10750H có sức mạnh đột phá để mang đến trải nghiệm chơi game đỉnh cao. Trả góp 0% xét duyệt nhanh, miễn phí giao hàng, bảo hành chính hãng 1 năm", CreatedDate = DateTime.Now,RateCount = 1, RateTotal = 1, BrandId = 11, CategoryId = 4}
                };
                await _context.AddRangeAsync(products);
            }
            await _context.SaveChangesAsync();

            if (!_context.Specifications.Any())
            {
                var specifications = new List<Specification>
{
                    new Specification(){Cpu = "Intel Core i9-9th-gen", Ram = "16 GB, DDR4, 2666 MHz", Screen="16.0\", 3072 x 1920 Pixel, IPS, IPS LCD LED Backlit, True Tone",Graphic="AMD Radeon Pro 5500M 4 GB & Intel UHD Graphics 630", HardWare="SSD 1 TB", Os="Mac OS", Weight=2.0, Size="357.9 x 24.59 x 16.2", Origin="Trung Quốc",  ReleasedYear=2019, ProductId=1},
                    new Specification(){Cpu = "Intel Core i9-9th-gen", Ram = "16 GB, DDR4, 2666 MHz", Screen="16.0\", 3072 x 1920 Pixel, IPS, IPS LCD LED Backlit, True Tone",Graphic="AMD Radeon Pro 5500M 4 GB & Intel UHD Graphics 630", HardWare="SSD 512 GB", Os="Mac OS", Weight=2.0, Size="357.9 x 24.59 x 16.2", Origin="Trung Quốc",  ReleasedYear=2019, ProductId=2},
                    new Specification(){Cpu = "Apple M1", Ram = "	8 GB, LPDDR4", Screen="13.3\", 2560 x 1600 Pixel, IPS, IPS LCD LED Backlit, True Tone",Graphic="Apple M1 GPU 8 nhân", HardWare="SSD 512 GB", Os="Mac OS", Weight=1.4, Size="304.1 x 212.4 x 15.6", Origin="Trung Quốc",  ReleasedYear=2020, ProductId=3},
                    new Specification(){Cpu = "Intel Core i5-10th-gen", Ram = "16 GB, LPDDR4X, 3733 MHz", Screen="13.3\", 2560 x 1600 Pixel, IPS, IPS LCD LED Backlit, True Tone",Graphic="Intel Iris Plus Graphics", HardWare="SSD 512 GB", Os="Mac OS", Weight=1.4, Size="304.1 x 212.4 x 15.6", Origin="Trung Quốc",  ReleasedYear=2020, ProductId=4},

                    new Specification(){Cpu = "Intel Core i7-11370H", Ram = "8 GB, DDR4, 3200 MHz", Screen="15.6\", 1920 x 1080 Pixel, IPS, 144 Hz, 250 nits, Anti-glare LED-backlit",Graphic="NVIDIA GeForce RTX 3050Ti 4 GB & Intel Iris Xe Graphics", HardWare="SSD 512 GB", Os="Windows 10", Weight=2.072, Size="360 x 252 x 19.9", Origin="Trung Quốc",  ReleasedYear=2021, ProductId=5},
                    new Specification(){Cpu = "Intel Core i5-1135G7", Ram = "8 GB, LPDDR4X, 3200 MHz", Screen="1920 x 1080 Pixel, IPS, 60 Hz, 400 nits, Anti-glare LED-backlit",Graphic="Intel Iris Xe Graphics", HardWare="SSD 512 GB", Os="Windows 10", Weight=1.17, Size="319 x 208 x 13.9", Origin="Trung Quốc",  ReleasedYear=2021, ProductId=6},
                    new Specification(){Cpu = "Intel Core i7-11370H", Ram = "8 GB, DDR4, 3200 MHz", Screen="15.6\", 1920 x 1080 Pixel, IPS, 144 Hz, 250 nits, Anti-glare LED-backlit",Graphic="NVIDIA GeForce RTX 3050Ti 4 GB & Intel Iris Xe Graphics", HardWare="SSD 512 GB", Os="Windows 10", Weight=2.072, Size="360 x 252 x 19.9", Origin="Trung Quốc",  ReleasedYear=2021, ProductId=7},

                    new Specification(){Cpu = "Intel Core i7-10750H", Ram = "16 GB, DDR4, 2933 MHz", Screen="	15.6\", 1920 x 1080 Pixel, WVA, 120 Hz, 250 nits, WVA Anti-glare LED Backlit Narrow Border",Graphic="NVIDIA GeForce GTX 1660Ti 6 GB & Intel UHD Graphics", HardWare="SSD 512 GB", Os="Windows 10", Weight=2.58, Size="364.46 x 254 x 21.60 ~ 30.96", Origin="Trung Quốc",  ReleasedYear=2020, ProductId=8}

                };
                await _context.AddRangeAsync(specifications);
            }

            if (!_context.ProductImages.Any())
            {
                
                var productImages = new List<ProductImage>
                {
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = true, DateCreated = null, ProductId = 1},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 1},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 1},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 1},

                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = true, DateCreated = null, ProductId = 2},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 2},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 2},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 2},

                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = true, DateCreated = null, ProductId = 3},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 3},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 3},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 3},

                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = true, DateCreated = null, ProductId = 4},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 4},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 4},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 4},

                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = true, DateCreated = null, ProductId = 5},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 5},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 5},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 5},

                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = true, DateCreated = null, ProductId = 6},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 6},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 6},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 6},

                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = true, DateCreated = null, ProductId = 7},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 7},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 7},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 7},

                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = true, DateCreated = null, ProductId = 8},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 8},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 8},
                    new ProductImage(){Path = "https://localhost:44345/uploaded/images/empty.jpg", Caption = null, IsDefault = false, DateCreated = null, ProductId = 8}

                };
                await _context.AddRangeAsync(productImages);
            }
            await _context.SaveChangesAsync();

            if (!_context.ProductCategories.Any())
            {
                var productCategories = new List<ProductCategory>
                {
                    new ProductCategory(){ProductId = 1, CategoryId  = 4},
                    new ProductCategory(){ProductId = 2, CategoryId  = 4},
                    new ProductCategory(){ProductId = 3, CategoryId  = 4 },
                    new ProductCategory(){ProductId = 4, CategoryId  = 4},
                    new ProductCategory(){ProductId = 5, CategoryId  = 4},
                    new ProductCategory(){ProductId = 6, CategoryId  = 4},
                    new ProductCategory(){ProductId = 7, CategoryId  = 4},
                    new ProductCategory(){ProductId = 8, CategoryId  = 4}
                };
                await _context.AddRangeAsync(productCategories);
            }
            await _context.SaveChangesAsync();
            #endregion
        }
    }
}
