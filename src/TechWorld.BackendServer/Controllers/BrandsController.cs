using Microsoft.AspNetCore.Http;
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

namespace TechWorld.BackendServer.Controllers
{

    public class BrandsController : BaseController
    {
        private readonly ApplicationDbContext _context;
        private readonly ISequenceService _sequenceService;
        public BrandsController(ApplicationDbContext context, ISequenceService sequenceService)
        {
            _context = context;
            _sequenceService = sequenceService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var brands = _context.Brands;
            var brandVms = await brands.Select(x => new BrandVm() {
                Id = x.Id,
                Name = x.Name,
                CssClass = x.CssClass
            }).ToListAsync();
            return Ok(brandVms);

        }

        [HttpGet("/{categoryId}/Brands")]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            if (categoryId != 0)
            {
                var brands = _context.Brands.Where(x => x.CategoryId == categoryId);
                var brandVms = await brands.Select(x => new BrandVm()
                {
                    Id = x.Id,
                    Name = x.Name,
                    CssClass = x.CssClass
                }).ToListAsync();
                return Ok(brandVms);
            }
            return NotFound();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var brand = await CreatNewBrands().Where(x => x.Id == id).SingleOrDefaultAsync();

            if (brand != null)
            {
                var brandVm = new BrandVm()
                {
                    Id = brand.Id,
                    Name = brand.Name,
                    CssClass = brand.CssClass,
                    Category = brand.Category
                };
                return Ok(brandVm);
            }

            return BadRequest();

        }

        [HttpPost("/api/Brands/pagination")]
        public async Task<IActionResult> GetPaging([FromBody] PaginationRequest request)
        {
            var categorieVms = _context.Categories.Select(x => new CategoryVm()
            {
                Id = x.Id,
                Name = x.Name
            });

            var query = CreatNewBrands();
            if (!string.IsNullOrEmpty(request.Keyword))
            {
                query = query.Where(x => x.Name.Contains(request.Keyword));
            }
            var totalRow = await query.CountAsync();

            var items = await query
                .OrderBy(x => x.Id).ThenBy(x => x.Category.Id)
                .Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            var pagination = new Pagination<BrandVm>()
            {
                Items = items,
                TotalRow = totalRow,
                TotalPage = (int)Math.Ceiling((double)totalRow / request.PageSize),
                PageIndex = request.PageIndex,
                PageSize = request.PageSize
            };

            return Ok(pagination);

        }


        // POST api/<brandsController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] BrandCreateRequest request)
        {
            try
            {
                var brand = await _context.Brands.FindAsync(request.Id);
                if (brand != null)
                    return BadRequest();

                var entity = new Brand()
                {
                    Name = request.Name,
                    CssClass = request.CssClass,
                    CategoryId = request.CategoryId
                };
                _context.Brands.Add(entity);
                var result = await _context.SaveChangesAsync();


                _context.BrandCategories.Add(new BrandCategory()
                {
                    BrandId = entity.Id,
                    CategoryId = request.CategoryId
                });
                await _context.SaveChangesAsync();

                if (result > 0)
                {
                    return NoContent();
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiBadRequestResponse(ex.ToString()));
            }
            
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] BrandCreateRequest request)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
                return NotFound();

            var brandCategory = _context.BrandCategories.Where(x => x.CategoryId == brand.CategoryId && x.BrandId == request.Id).FirstOrDefault();
            if (brandCategory.CategoryId != request.CategoryId)
            {
                if (brandCategory != null)
                {
                    _context.BrandCategories.Remove(brandCategory);
                    _context.SaveChanges();
                }

                _context.BrandCategories.Add(new BrandCategory()
                {
                    CategoryId = request.CategoryId,
                    BrandId = request.Id
                });
                _context.SaveChanges();
            }

            brand.Name = request.Name;
            brand.CssClass = request.CssClass;
            brand.CategoryId = request.CategoryId;
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return NoContent();
            }
            return BadRequest();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
                return NotFound();

            var brandCategory = _context.BrandCategories.Where(x => x.CategoryId == brand.CategoryId && x.BrandId == id).ToList();
            if (brandCategory.Count > 0)
            {
                _context.BrandCategories.RemoveRange(brandCategory);
                _context.SaveChanges();
            }

            _context.Brands.Remove(brand);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
                return NoContent();
            return BadRequest();
        }

        private IQueryable<BrandVm> CreatNewBrands()
        {
            var categorieVms = _context.Categories.Select(x => new CategoryVm()
            {
                Id = x.Id,
                Name = x.Name
            });

            var brandVms = from b in _context.Brands
                        join bc in _context.BrandCategories on b.Id equals bc.BrandId
                        join c in categorieVms on bc.CategoryId equals c.Id
                        select new BrandVm()
                        {
                            Id = b.Id,
                            Name = b.Name,
                            CssClass = b.CssClass,
                            Category = c
                        };
            return brandVms;
        }
    }
}
