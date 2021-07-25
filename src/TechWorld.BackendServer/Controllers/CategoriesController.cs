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
    public class CategoriesController : BaseController
    {
        private readonly ApplicationDbContext _context;
        private readonly ISequenceService _sequenceService;
        public CategoriesController(ApplicationDbContext context, ISequenceService sequenceService)
        {
            _context = context;
            _sequenceService = sequenceService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var categories = _context.Categories;
            var categoryVms = await categories.Select(x => new CategoryVm() {
                Id = x.Id,
                Name = x.Name,
                ParentId = x.ParentId.Value,
                SeoAlias = x.SeoAlias,
                SeoDecription= x.SeoDecription,
                SeoKeyword = x.SeoKeyword,
                SeoTitle = x.SeoTitle,
                SortOrder = x.SortOrder
            }).ToListAsync();
            return Ok(categoryVms);

        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category != null)
            {
                var categoryVm = new CategoryVm()
                {
                    Id = category.Id,
                    Name = category.Name,
                    ParentId = category.ParentId.Value,
                    SeoAlias = category.SeoAlias,
                    SeoDecription = category.SeoDecription,
                    SeoKeyword = category.SeoKeyword,
                    SeoTitle = category.SeoTitle,
                    SortOrder = category.SortOrder
                };
                return Ok(categoryVm);
            }

            return BadRequest();

        }

        [HttpGet("filter")]
        public async Task<IActionResult> GetPaging(string filter, int pageIndex, int pageSize)
        {
            var query = _context.Categories.AsQueryable();
            if (!string.IsNullOrEmpty(filter))
            {
                query = query.Where(x => x.Name.Contains(filter));
            }
            var totalRow = await query.CountAsync();

            var items = await query
                .Take((pageIndex - 1) * pageSize)
                .Select(x => new CategoryVm()
                {
                    Id = x.Id,
                    Name = x.Name,
                    ParentId = x.ParentId.Value,
                    SeoAlias = x.SeoAlias,
                    SeoDecription = x.SeoDecription,
                    SeoKeyword = x.SeoKeyword,
                    SeoTitle = x.SeoTitle,
                    SortOrder = x.SortOrder
                })
                .Skip(pageSize).ToListAsync();

            var pagination = new Pagination<CategoryVm>()
            {
                Items = items,
                TotalRow = totalRow,
                TotalPage = (int)Math.Ceiling((double)totalRow / pageSize)
            };

            return Ok(pagination);

        }

       

        // POST api/<CategoriesController>
        [HttpPost]
        public async Task<IActionResult> Post([FromForm] CategoryCreateRequest request)
        {
            var category = await _context.Categories.FindAsync(request.Id);
            if (category != null)
                return BadRequest();

            var entity = new Category()
            {
                Name = request.Name,
                ParentId = request.ParentId.Value,
                SeoAlias = request.SeoAlias,
                SeoDecription = request.SeoDecription,
                SeoKeyword = request.SeoKeyword,
                SeoTitle = request.SeoTitle,
                SortOrder = request.SortOrder
            };
            entity.Id = await _sequenceService.GetNewId();
            _context.Categories.Add(entity);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return CreatedAtAction(nameof(Get), new { id = entity.Id });
            }
            return BadRequest();
        }

        // PUT api/<CategoriesController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] CategoryCreateRequest request)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound();

            category.Name = request.Name;
            category.SeoAlias = request.SeoAlias;
            category.SeoDecription = request.SeoDecription;
            category.SeoTitle = request.SeoTitle;
            category.SeoKeyword = request.SeoKeyword;
            _context.Categories.Update(category);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return NoContent();
            }
            return BadRequest();
        }

        // DELETE api/<CategoriesController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Categories.FindAsync(id);
            if (product == null)
                return NotFound();
            _context.Categories.Remove(product);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
                return NoContent();
            return BadRequest();
        }
    }
}
