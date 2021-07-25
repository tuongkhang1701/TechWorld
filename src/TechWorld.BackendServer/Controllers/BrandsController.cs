using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TechWorld.BackendServer.Data;
using TechWorld.BackendServer.Data.Entities.Contents;
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

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var brand = await _context.Brands.FindAsync(id);

            if (brand != null)
            {
                var brandVm = new BrandVm()
                {
                    Id = brand.Id,
                    Name = brand.Name,
                    CssClass = brand.CssClass
                };
                return Ok(brandVm);
            }

            return BadRequest();

        }

        [HttpGet("filter")]
        public async Task<IActionResult> GetPaging(string filter, int pageIndex, int pageSize)
        {
            var query = _context.Brands.AsQueryable();
            if (!string.IsNullOrEmpty(filter))
            {
                query = query.Where(x => x.Name.Contains(filter));
            }
            var totalRow = await query.CountAsync();

            var items = await query
                .Take((pageIndex - 1) * pageSize)
                .Select(x => new BrandVm()
                {
                    Id = x.Id,
                    Name = x.Name,
                    CssClass = x.CssClass
                })
                .Skip(pageSize).ToListAsync();

            var pagination = new Pagination<BrandVm>()
            {
                Items = items,
                TotalRow = totalRow,
                TotalPage = (int)Math.Ceiling((double)totalRow / pageSize)
            };

            return Ok(pagination);

        }

        // POST api/<brandsController>
        [HttpPost]
        public async Task<IActionResult> Post([FromForm] BrandCreateRequest request)
        {
            var brand = await _context.Brands.FindAsync(request.Id);
            if (brand != null)
                return BadRequest();

            var entity = new Brand()
            {
                Id = brand.Id,
                Name = brand.Name,
                CssClass = brand.CssClass
            };
            entity.Id = await _sequenceService.GetNewId();
            _context.Brands.Add(entity);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return CreatedAtAction(nameof(Get), new { id = entity.Id });
            }
            return BadRequest();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] BrandCreateRequest request)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
                return NotFound();

            brand.Name = request.Name;
            brand.CssClass = request.CssClass;
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
            _context.Brands.Remove(brand);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
                return NoContent();
            return BadRequest();
        }
    }
}
