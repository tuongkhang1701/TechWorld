using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TechWorld.BackendServer.Data;
using TechWorld.BackendServer.Data.Entities.Contents;
using TechWorld.BackendServer.Helpers;
using TechWorld.BackendServer.Services;
using TechWorld.ViewModels;
using TechWorld.ViewModels.Contents;
using static System.Net.Mime.MediaTypeNames;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TechWorld.BackendServer.Controllers
{
    public class ProductsController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context, ISequenceService sequenceService)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var productVms = await CreatNewProduct().ToListAsync();
            return Ok(productVms);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product != null)
            {
                var productVm = await CreatNewProduct().Where(x => x.Id == id).SingleOrDefaultAsync();

                if (productVm == null)
                    return BadRequest();
                return Ok(productVm);
            }

            return BadRequest();
        }

        [HttpPost("pagination")]
        public async Task<IActionResult> GetPaging([FromBody] PaginationRequest request)
        {
            try
            {

                var query = CreatNewProduct();
                if (!string.IsNullOrEmpty(request.Keyword))
                {
                    query = query.Where(x => x.Name.Contains(request.Keyword) || x.Description.Contains(request.Keyword) || x.Content.Contains(request.Keyword));
                }
                var totalRow = await query.CountAsync();

                var items = await query
                    .OrderBy(x => x.Id)
                    .Skip((request.PageIndex - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToListAsync();

                var pagination = new Pagination<ProductVm>()
                {
                    Items = items,
                    TotalRow = totalRow,
                    TotalPage = (int)Math.Ceiling((double)totalRow / request.PageSize),
                    PageIndex = request.PageIndex,
                    PageSize = request.PageSize
                };

                return Ok(pagination);
            }
            catch (Exception ex)
            {

                return BadRequest(new ApiBadRequestResponse(ex.ToString()));
            }

        }

        private IQueryable<ProductVm> CreatNewProduct()
        {
            var now = DateTime.Now.ToString("yyyyMMdd");
            var urlNow = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/uploaded/images/{now}/";
            var urlEmpty = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/uploaded/images/empty.jpg";
            var categoryVms = _context.Categories.Select(c => new CategoryVm
            {
                Id = c.Id,
                Name = c.Name,
                SeoAlias = c.SeoAlias,
                SeoDescription = c.SeoDescription,
                SeoKeyword = c.SeoKeyword,
                SeoTitle = c.SeoTitle,
                SortOrder = c.SortOrder
            });

            var brandVms = _context.Brands.Select(b => new BrandVm
            {
                Id = b.Id,
                Name = b.Name,
                CssClass = b.CssClass
            });
            var productVms = from p in _context.Products
                             join pc in _context.ProductCategories on p.Id equals pc.ProductId
                             join c in categoryVms on pc.CategoryId equals c.Id
                             join b in brandVms on p.BrandId equals b.Id
                             join pi in _context.ProductImages on p.Id equals pi.ProductId into pis
                             from pIs in pis.DefaultIfEmpty()
                             where pIs.IsDefault == true
                             select new ProductVm()
                             {
                                 Id = p.Id,
                                 Name = p.Name,
                                 Content = p.Content,
                                 Price = p.Price,
                                 OriginalPrice = p.OriginalPrice,
                                 PromotionPrice = p.PromotionPrice,
                                 Quantity = p.Quantity,
                                 Description = p.Description,
                                 BrandId = p.BrandId,
                                 Brand = b,
                                 DefaultImage = pIs.Path==null?urlEmpty:pIs.Path,
                                 /*https://localhost:44345/uploaded/images/20210806/download.jfif*/
                                 /*Image = pIs.Path != null? string.Format("{0}://{1}/uploaded/images/{2}/{3}", HttpContext.Request.Scheme, HttpContext.Request.Host, pIs.DateCreated.ToString("yyyyMMdd"), pIs.Path): string.Empty,*/
                                 CategoryId = p.CategoryId,
                                 Category = c,
                                 SeoAlias = p.SeoAlias,
                                 SeoDescription = p.SeoDescription,
                                 SeoTitle = p.SeoTitle,
                                 SeoKeyword = p.SeoKeyword,
                                 CreatedDate = p.CreatedDate,
                                 UpdatedDate = p.UpdatedDate,
                                 RateCount = p.RateCount,
                                 RateTotal = p.RateTotal,
                                 ViewCount = p.ViewCount
                             };
            return productVms;
        }

        // POST api/<ProductsController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ProductCreateRequest request)
        {
            try
            {
                var now = DateTime.Now.ToString("yyyyMMdd");
                var urlNow = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/uploaded/images/{now}/";
                var urlEmpty = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/uploaded/images/empty.jpg";

                if (request.Id != 0)
                {
                    var dbProduct = await _context.Products.FindAsync(request.Id);
                    if (dbProduct != null)
                        return BadRequest(new ApiBadRequestResponse("Product has existed"));
                }

                var entity = new Product()
                {
                    Name = request.Name,
                    Content = request.Content,
                    Price = request.Price,
                    OriginalPrice = request.OriginalPrice,
                    PromotionPrice = request.PromotionPrice,
                    Quantity = request.Quantity,
                    Description = request.Description,
                    BrandId = request.BrandId,
                    CategoryId = request.CategoryId,
                    SeoAlias = request.SeoAlias,
                    SeoDescription = request.SeoDescription,
                    SeoTitle = request.SeoTitle,
                    SeoKeyword = request.SeoKeyword,
                    CreatedDate = DateTime.Now
                };
                _context.Products.Add(entity);
                var result = await _context.SaveChangesAsync();

                _context.ProductCategories.Add(new ProductCategory()
                {
                    CategoryId = request.CategoryId,
                    ProductId = entity.Id
                });
                await _context.SaveChangesAsync();
                Product res = await _context.Products.FindAsync(entity.Id);
                if (result > 0)
                {
                    _context.ProductImages.AddRange(new List<ProductImage>()
                    {
                        new ProductImage(){Path = urlEmpty, Caption = null, IsDefault = true, DateCreated = null, ProductId = res.Id},
                        new ProductImage(){Path = urlEmpty, Caption = null, IsDefault = false, DateCreated = null, ProductId = res.Id},
                        new ProductImage(){Path = urlEmpty, Caption = null, IsDefault = false, DateCreated = null, ProductId = res.Id},
                        new ProductImage(){Path = urlEmpty, Caption = null, IsDefault = false, DateCreated = null, ProductId = res.Id}
                    });
                    await _context.SaveChangesAsync();
                    return Ok(res.Id);
                }

                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiBadRequestResponse(ex.ToString()));
            }

        }

        // PUT api/<ProductsController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ProductCreateRequest request)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            var productCategory = _context.ProductCategories.Where(x => x.CategoryId == product.CategoryId && x.ProductId == request.Id).FirstOrDefault();
            if (productCategory != null)
                if (productCategory.CategoryId != request.CategoryId)
                {
                    {
                        _context.ProductCategories.Remove(productCategory);
                        _context.SaveChanges();
                    }

                    _context.ProductCategories.Add(new ProductCategory()
                    {
                        CategoryId = request.CategoryId,
                        ProductId = request.Id
                    });
                    _context.SaveChanges();
                }
            product.Name = request.Name;
            product.Content = request.Content;
            product.Price = request.Price;
            product.OriginalPrice = request.OriginalPrice;
            product.PromotionPrice = request.PromotionPrice;
            product.Quantity = request.Quantity;
            product.Description = request.Description;
            product.BrandId = request.BrandId;
            product.CategoryId = request.CategoryId;
            product.SeoAlias = request.SeoAlias;
            product.SeoDescription = request.SeoDescription;
            product.SeoTitle = request.SeoTitle;
            product.SeoKeyword = request.SeoKeyword;
            product.UpdatedDate = DateTime.Now;
            _context.Products.Update(product);

            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return Ok(id);
            }
            return BadRequest();
        }

        // DELETE api/<ProductsController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            var productCategory = _context.ProductCategories.Where(x => x.CategoryId == product.CategoryId && x.ProductId == product.Id).ToList();
            if (productCategory.Count > 0)
            {
                _context.ProductCategories.RemoveRange(productCategory);
                _context.SaveChanges();
            }

            var productImages = _context.ProductImages.Where(x => x.ProductId == id).ToList();
            if (productImages.Count > 0)
            {
                _context.ProductImages.RemoveRange(productImages);
                _context.SaveChanges();
            }

            _context.Products.Remove(product);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
                return NoContent();
            return BadRequest();
        }

        [HttpPost("{productId}/save-images")]
        public async Task<IActionResult> SaveImage(int productId, [FromBody] string[] imageList)
        {
            try
            {
                var now = DateTime.Now.ToString("yyyyMMdd");
                var url = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/uploaded/images/{now}/";
                var imageDbs = await _context.ProductImages.Where(x => x.ProductId == productId).ToListAsync();
                if (imageDbs.Count > 0)
                    _context.RemoveRange(imageDbs);
                for (int i = 0; i < imageList.Length; i++)
                {
                    _context.ProductImages.Add(new ProductImage()
                    {
                        Path = url + imageList[i],
                        ProductId = productId,
                        Caption = imageList[i],
                        DateCreated = DateTime.Now,
                        IsDefault = i == 0 ? true : false
                    });
                }
                var result = await _context.SaveChangesAsync();
                if (result > 0)
                    return Ok(imageDbs);
                return BadRequest(new ApiBadRequestResponse("Has an error while adding images"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiBadRequestResponse(ex.ToString()));
            }

        }

        [HttpGet("get-images")]
        public IActionResult GetImages()
        {
            var imageList = _context.ProductImages.ToList();
            if (imageList.Count > 0)
                return Ok(imageList);
            return BadRequest(new ApiBadRequestResponse("Has an error while getting images"));
        }

        [HttpGet("{productId}/get-image")]
        public async Task<IActionResult> GetImagesById(int productId)
        {
            var imageList = await _context.ProductImages
                .Where(x => x.ProductId == productId)
                .Select(x => new ProductImage() { 
                    Id = x.Id,
                    Path = x.Path,
                    Caption = x.Caption,
                    DateCreated = x.DateCreated,
                    IsDefault = x.IsDefault,
                    ProductId = x.ProductId
                })
                .ToListAsync();

            if (imageList.Count > 0)
                return Ok(imageList);
            return BadRequest(new ApiBadRequestResponse("Has an error while getting images"));
        }
    }
}