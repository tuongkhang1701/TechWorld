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
            var products = _context.Products;
            var productVms = await products.Select(x => CreatNewProduct(x)).ToListAsync();
            return Ok(productVms);

        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product != null)
            {
                var productVm = CreatNewProduct(product);
                return Ok(productVm);
            }

            return BadRequest();

        }

        [HttpPost("/api/Products/pagination")]
        public async Task<IActionResult> GetPaging([FromBody]PaginationRequest request)
        {
            var query = _context.Products.AsQueryable();
            if (!string.IsNullOrEmpty(request.Keyword))
            {
                query = query.Where(x => x.Name.Contains(request.Keyword) || x.Description.Contains(request.Keyword) || x.Content.Contains(request.Keyword));
            }
            var totalRow = await query.CountAsync();

            var items = await query
                .Skip((request.PageIndex - 1) * request.PageSize)
                .Select(x => CreatNewProduct(x))
                .Take(request.PageSize).ToListAsync();

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

        private static ProductVm CreatNewProduct(Product product)
        {
            return new ProductVm()
            {
                Id = product.Id,
                Name = product.Name,
                Content = product.Content,
                Price = product.Price,
                OriginalPrice = product.OriginalPrice,
                PromotionPrice = product.PromotionPrice,
                ImageList = product.ImageList,
                ImageUrl = product.ImageUrl,
                Quantity = product.Quantity,
                Decription = product.Description,
                BrandId = product.BrandId,
                SeoAlias = product.SeoAlias,
                SeoDecription = product.SeoDecription,
                SeoTitle = product.SeoTitle,
                SeoKeyword = product.SeoKeyword,
                CreatedDate = product.CreatedDate,
                UpdatedDate = product.UpdatedDate,
                RateCount = product.RateCount,
                RateTotal = product.RateTotal,
                ViewCount = product.ViewCount
            };
        }

        // POST api/<ProductsController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ProductCreateRequest request)
        {
            var dbProduct = await _context.Products.FindAsync(request.Id);
            if (dbProduct != null)
                return BadRequest(new ApiBadRequestResponse("Product has existed"));

            var entity = new Product()
            {
                Name = request.Name,
                Content = request.Content,
                Price = request.Price,
                OriginalPrice = request.OriginalPrice,
                PromotionPrice = request.PromotionPrice,
                ImageList = request.ImageList,
                ImageUrl = request.ImageUrl,
                Quantity = request.Quantity,
                Description = request.Description,
                BrandId = request.BrandId,
                SeoAlias = request.SeoAlias,
                SeoDecription = request.SeoDecription,
                SeoTitle = request.SeoTitle,
                SeoKeyword = request.SeoKeyword,
                CreatedDate = DateTime.Now
            };
            _context.Products.Add(entity);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return NoContent();
            }
            return BadRequest();
        }

        // PUT api/<ProductsController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ProductCreateRequest request)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            product.Name = request.Name;
            product.Content = request.Content;
            product.Price = request.Price;
            product.OriginalPrice = request.OriginalPrice;
            product.PromotionPrice = request.PromotionPrice;
            product.ImageList = request.ImageList;
            product.ImageUrl = request.ImageUrl;
            product.Quantity = request.Quantity;
            product.Description = request.Description;
            product.BrandId = request.BrandId;
            product.SeoAlias = request.SeoAlias;
            product.SeoDecription = request.SeoDecription;
            product.SeoTitle = request.SeoTitle;
            product.SeoKeyword = request.SeoKeyword;
            product.CreatedDate = DateTime.Now;
            product.UpdatedDate = DateTime.Now;
            _context.Products.Update(product);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return NoContent();
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
            _context.Products.Remove(product);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
                return NoContent();
            return BadRequest();
        }
    }
}
