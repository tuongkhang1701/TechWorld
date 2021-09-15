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
using TechWorld.ViewModels;
using TechWorld.ViewModels.Contents;
using TechWorld.BackendServer.Extensions;

namespace TechWorld.BackendServer.Controllers
{
    public class AddressesController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public AddressesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = User.GetSpecificClaim(ClaimTypes.NameIdentifier);
            var addressVms = await _context.Address.Where(x => x.UserId == userId).ToListAsync();
            if (addressVms.Count == 0)
                return NotFound();
            return Ok(addressVms);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var address = await _context.Address.FindAsync(id);
            if (address == null)
                return NotFound();

            return Ok(address);
        }

        // POST api/<ProductsController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AddressCreateRequest request)
        {
            try
            {
                if (request.IsDefault)
                {
                    var list = await _context.Address.ToListAsync();
                    foreach (var item in list)
                    {
                        if (item.IsDefault)
                            item.IsDefault = false;
                        _context.Address.Update(item);
                        await _context.SaveChangesAsync();
                    }
                }

                await _context.Address.AddAsync(new Address()
                {
                    UserId = User.GetSpecificClaim(ClaimTypes.NameIdentifier),
                    FullName = request.FullName,
                    Phone = request.Phone,
                    ProvinceName = request.ProvinceName,
                    DistrictName = request.DistrictName,
                    WardName = request.WardName,
                    StreetAddress = request.StreetAddress,
                    FullStreetAddress = string.Format("{0}, {1}, {2}, {3}", request.StreetAddress, request.WardName, request.DistrictName, request.ProvinceName),
                    IsDefault = request.IsDefault
                });

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

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] AddressCreateRequest request)
        {
            var address = await _context.Address.FindAsync(id);
            
            if (address == null)
                return NotFound();

            if (request.IsDefault)
            {
                var list = await _context.Address.ToListAsync();
                foreach (var item in list)
                {
                    if (item.IsDefault)
                        item.IsDefault = false;
                    _context.Address.Update(item);
                    await _context.SaveChangesAsync();
                }
            }
            address.FullName = request.FullName;
            address.Phone = request.Phone;
            address.ProvinceName = request.ProvinceName;
            address.DistrictName = request.DistrictName;
            address.WardName = request.WardName;
            address.StreetAddress = request.StreetAddress;
            address.IsDefault = request.IsDefault;
            address.FullStreetAddress = string.Format("{0}, {1}, {2}, {3}", request.StreetAddress, request.WardName, request.DistrictName, request.ProvinceName);
            _context.Address.Update(address);
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
            var address = await _context.Address.FindAsync(id);
            if (address == null)
                return NotFound();

            _context.Address.Remove(address);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
                return NoContent();
            return BadRequest();
        }
        
        [HttpPut("{id}/set-default")]
        public async Task<IActionResult> SetDefault(int id)
        {
            var address = await _context.Address.FindAsync(id);
            if (address == null)
                return NotFound();

            if (!address.IsDefault)
            {
                var list = await _context.Address.ToListAsync();
                foreach (var item in list)
                {
                    if (item.IsDefault)
                        item.IsDefault = false;
                    _context.Address.Update(item);
                    await _context.SaveChangesAsync();
                }
            }
            address.IsDefault = true;
            _context.Address.Update(address);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
                return NoContent();
            return BadRequest();
        }

    }
}
