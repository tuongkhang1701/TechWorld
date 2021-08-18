using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TechWorld.BackendServer.Data.Entities.Contents;
using TechWorld.BackendServer.Helpers;
using TechWorld.ViewModels.Contents;
using TechWorld.ViewModels;
using TechWorld.BackendServer.Data;

namespace TechWorld.BackendServer.Controllers
{
    public class OrdersController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var orders = _context.Orders;
            var categoryVms = await orders.Select(x => new CategoryVm()
            {
                Id = x.Id,
                Name = x.Name,
                SeoAlias = x.SeoAlias,
                SeoDescription = x.SeoDescription,
                SeoKeyword = x.SeoKeyword,
                SeoTitle = x.SeoTitle,
                SortOrder = x.SortOrder
            }).ToListAsync();
            return Ok(categoryVms);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var category = await _context.Orders.FindAsync(id);

                if (category != null)
                {
                    var categoryVm = new CategoryVm()
                    {
                        Id = category.Id,
                        Name = category.Name,
                        SeoAlias = category.SeoAlias,
                        SeoDescription = category.SeoDescription,
                        SeoKeyword = category.SeoKeyword,
                        SeoTitle = category.SeoTitle,
                        SortOrder = category.SortOrder
                    };
                    return Ok(categoryVm);
                }

                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiBadRequestResponse(ex.ToString()));
            }
        }

        [HttpPost("/api/orders/pagination")]
        public async Task<IActionResult> GetPaging([FromBody] PaginationRequest request)
        {
            var query = _context.orders.AsQueryable();
            if (!string.IsNullOrEmpty(request.Keyword))
            {
                query = query.Where(x => x.Name.Contains(request.Keyword));
            }
            var totalRow = await query.CountAsync();

            var items = await query
                .Skip((request.PageIndex - 1) * request.PageSize)
                .Select(x => new CategoryVm()
                {
                    Id = x.Id,
                    Name = x.Name,
                    SeoAlias = x.SeoAlias,
                    SeoDescription = x.SeoDescription,
                    SeoKeyword = x.SeoKeyword,
                    SeoTitle = x.SeoTitle,
                    SortOrder = x.SortOrder
                })
                .Take(request.PageSize).ToListAsync();

            var pagination = new Pagination<CategoryVm>()
            {
                Items = items,
                TotalRow = totalRow,
                TotalPage = (int)Math.Ceiling((double)totalRow / request.PageSize),
                PageIndex = request.PageIndex,
                PageSize = request.PageSize
            };

            return Ok(pagination);

        }



        // POST api/<ordersController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CategoryCreateRequest request)
        {
            try
            {
                var category = await _context.orders.FindAsync(request.Id);
                if (category != null)
                    return BadRequest();

                var entity = new Category()
                {
                    Name = request.Name,
                    SeoAlias = request.SeoAlias,
                    SeoDescription = request.SeoDescription,
                    SeoKeyword = request.SeoKeyword,
                    SeoTitle = request.SeoTitle
                };
                _context.orders.Add(entity);
                var result = await _context.SaveChangesAsync();
                if (result > 0)
                {
                    return CreatedAtAction(nameof(Get), new { id = entity.Id });
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiBadRequestResponse(ex.ToString()));

            }

        }

        // PUT api/<ordersController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] CategoryCreateRequest request)
        {
            try
            {
                var category = await _context.orders.FindAsync(id);
                if (category == null)
                    return NotFound();

                category.Name = request.Name;
                category.SeoAlias = request.SeoAlias;
                category.SeoDescription = request.SeoDescription;
                category.SeoTitle = request.SeoTitle;
                category.SeoKeyword = request.SeoKeyword;
                _context.orders.Update(category);
                var result = await _context.SaveChangesAsync();
                if (result > 0)
                {
                    return Ok(id);
                }
                return BadRequest();
            }
            catch (Exception ex)
            {

                return BadRequest(new ApiBadRequestResponse(ex.ToString()));
            }

        }

        // DELETE api/<ordersController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.orders.FindAsync(id);
            if (product == null)
                return NotFound();
            _context.orders.Remove(product);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
                return NoContent();
            return BadRequest();
        }
    }
}
