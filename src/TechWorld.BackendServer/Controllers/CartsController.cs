using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TechWorld.BackendServer.Data;
using TechWorld.BackendServer.Data.Entities.Contents;
using TechWorld.BackendServer.Helpers;
using TechWorld.ViewModels.Contents;

namespace TechWorld.BackendServer.Controllers
{
    public class CartsController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public CartsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var now = DateTime.Now.ToString("yyyyMMdd");
                var urlNow = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/uploaded/images/{now}/";
                var urlEmpty = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/uploaded/images/empty.jpg";

                var productVms = from p in _context.Products
                                 join pi in _context.ProductImages on p.Id equals pi.ProductId into pis
                                 from pIs in pis.DefaultIfEmpty()
                                 where pIs.IsDefault == true
                                 select new ProductVm()
                                 {
                                     Id = p.Id,
                                     Name = p.Name,
                                     DefaultImage = pIs.Path == null ? urlEmpty : pIs.Path,
                                     PromotionPrice = p.PromotionPrice,
                                     Price = p.Price
                                 };
                var cartVms = await (from c in _context.Carts
                                     join p in productVms on c.ProductId equals p.Id
                                     select new CartVm()
                                     {
                                         Id = c.Id,
                                         Product = p,
                                         Quantity = c.Quantity
                                     }).ToListAsync();
                if (cartVms.Count > 0)
                    return Ok(cartVms);
                return NoContent();
            }
            catch (Exception ex)
            {

                return BadRequest(new ApiBadRequestResponse(ex.ToString()));
            }
            
        }

        [HttpGet("{productId}")]
        public async Task<IActionResult> Get(int productId)
        {
            var carts = await _context.Carts.Where(x => x.ProductId == productId).ToListAsync();

            if (carts.Count > 0)
                return Ok(carts);
            return BadRequest();

        }

        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] CartCreateRequest request)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;


                var productExisted = await _context.Carts.Where(x => x.ProductId == request.ProductId && x.UserId == userId).SingleOrDefaultAsync();
                if (productExisted == null)
                {
                    _context.Carts.Add(new Cart()
                    {
                        ProductId = request.ProductId,
                        UserId = userId,
                        Quantity = 1
                    });
                }
                else
                {
                    productExisted.Quantity++;
                }
                var result = await _context.SaveChangesAsync();

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

        [HttpPost("update-cart")]
        public async Task<IActionResult> UpdateCart([FromBody] CartCreateRequest request)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                var productExisted = await _context.Carts.Where(x => x.ProductId == request.ProductId && x.UserId == userId).SingleOrDefaultAsync();
                if (productExisted == null)
                {
                    return BadRequest(new ApiBadRequestResponse($"Product with an id {request.ProductId} hasn't existed"));
                }
                if (request.Quantity == 0)
                    _context.Carts.Remove(productExisted);
                else
                    productExisted.Quantity = request.Quantity;
                var result = await _context.SaveChangesAsync();
                if (result > 0)
                    return NoContent();

                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiBadRequestResponse(ex.ToString()));
            }
        }

        [HttpDelete("{productId}")]
        public async Task<IActionResult> DeleteFromCart(int productId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                var productExisted = await _context.Carts.Where(x => x.ProductId == productId && x.UserId == userId).SingleOrDefaultAsync();
                if (productExisted == null)
                    return BadRequest(new ApiBadRequestResponse($"Product with an id {productId} hasn't existed"));

                _context.Carts.Remove(productExisted);
                var result = await _context.SaveChangesAsync();
                if (result > 0)
                    return NoContent();

                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiBadRequestResponse(ex.ToString()));
            }
        }
    }
}
