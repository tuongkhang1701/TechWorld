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
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var id = User.GetSpecificClaim(ClaimTypes.NameIdentifier);
            var orders = await _context.Orders.Include("OrderDetails").Where(x  => x.CustomerId == id).Select(x => new OrderVm()
            {
                OrderDetails = x.OrderDetails.Select(z => new OrderDetailVm()
                {
                    Image = z.Image,
                    OrderId = z.OrderId.ToString(),
                    Price = z.Price,
                    ProductId = z.ProductId,
                    ProductName = z.ProductName,
                    PromotionPrice = z.PromotionPrice,
                    Quantity = z.Quantity
                }).ToList(),
                PaymentMethodId = x.PaymentMethodId,
                Id = x.Id.ToString(),
                Status = x.Status
            })
               .Join(_context.PaymentMethods,
                   order => order.PaymentMethodId,
                   pay => pay.Id,
                   (order, pay) => new
                   {
                       OrderDetails = order.OrderDetails,
                       PaymentMethodName = pay.Name,
                       Id = order.Id,
                       Status = order.Status
                   }).ToListAsync();
            
            return Ok(orders);
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
                    CustomerId = userId,
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


        [HttpPost("{id}/update-status/{type}")]
        public async Task<IActionResult> UpdateStatus(string id, int type)
        {
            var order = await _context.Orders.Where(x => x.Id.ToString() == id).SingleOrDefaultAsync();
            if (order == null)
                return NotFound();
            switch (type)
            {
                case 0: order.Status = StatusOrder.WaitForConfirmation;break;

                case 1: order.Status = StatusOrder.Delivering; break;

                case 2: order.Status = StatusOrder.Delivered; break;

                case 3: order.Status = StatusOrder.Canceled; break;
            }
            _context.Update(order);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
