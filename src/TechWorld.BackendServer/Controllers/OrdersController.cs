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
using TechWorld.ViewModels.Contants;
using TechWorld.BackendServer.Extensions;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace TechWorld.BackendServer.Controllers
{
    public class OrdersController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            //List<Order> orders = await _context.Orders.Include("OrderDetails").ToListAsync();
            List<Order> orders = await _context.Orders.ToListAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {

                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiBadRequestResponse(ex.ToString()));
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] OrderCreateRequest request)
        {
            try
            {
                var userId = User.GetSpecificClaim(ClaimTypes.NameIdentifier);
                var address = await _context.Address.Where(x => x.Id == request.AddressId).SingleOrDefaultAsync();
                var orderDetails = await _context.Carts.Where(x => x.UserId == userId).Select(x => new OrderDetail
                {
                    ProductId = x.ProductId,
                    Price = x.Price,
                    Quantity = x.Quantity,
                    Image = x.Image,
                    ProductName = x.ProductName,
                    PromotionPrice = x.PromotionPrice,
                }).ToListAsync();

                if (address == null)
                    return BadRequest();

                var orders = new Order()
                {
                    Id = Guid.NewGuid(),
                    CustomerId = User.GetSpecificClaim(ClaimTypes.NameIdentifier),
                    CustomerAddress = address.FullStreetAddress,
                    CustomerEmail = User.GetSpecificClaim(ClaimTypes.Email),
                    CustomerName = address.FullName,
                    PaymentMethodId = request.PaymentMethodId,
                    CustomerPhone = address.Phone,
                    CreatedDate = DateTime.Now,
                    OrderDetails = orderDetails,
                    Status = StatusOrder.WaitForConfirmation
                };
                await _context.Orders.AddAsync(orders);
                var result = await _context.SaveChangesAsync();
                if (result > 0)
                    return Ok();
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
           
            return BadRequest();
        }
    }
}
