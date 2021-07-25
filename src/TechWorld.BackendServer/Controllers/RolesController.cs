using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TechWorld.BackendServer.Data;
using TechWorld.BackendServer.Data.Entities.Systems;
using TechWorld.BackendServer.Helpers;
using TechWorld.ViewModels;
using TechWorld.ViewModels.Systems;

namespace TechWorld.BackendServer.Controllers
{
    public class RolesController : BaseController
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;
        public RolesController(RoleManager<IdentityRole> roleManager, ApplicationDbContext context)
        {
            _roleManager = roleManager;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var roles = _roleManager.Roles;
            var roleVms = await roles.Select(x => new RoleVm()
            {
                Id = x.Id,
                Name = x.Name,
                NormalizedName = x.NormalizedName
            }).ToListAsync();
            return Ok(roleVms);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
            {
                return NotFound(new ApiNotFoundResponse($"Cannot find role with id {id}"));
            }
            var roleVm = new RoleVm()
            {
                Id = role.Id,
                Name = role.Name,
                NormalizedName = role.NormalizedName
            };
            return Ok(roleVm);
        }

        [HttpGet("filter")]
        public async Task<IActionResult> GetPaging(string filter, int pageIndex, int pageSize)
        {
            var query = _roleManager.Roles.AsQueryable();
            if (!string.IsNullOrEmpty(filter))
            {
                query = query.Where(x => x.NormalizedName.Contains(filter) || x.Name.Contains(filter));
            }
            var totalRow = await query.CountAsync();

            var items = await query
                .Take((pageIndex - 1) * pageSize)
                .Select(x => new RoleVm()
                {
                    Id = x.Id,
                    Name = x.Name,
                    NormalizedName = x.NormalizedName
                })
                .Skip(pageSize).ToListAsync();

            var pagination = new Pagination<RoleVm>()
            {
                Items = items,
                TotalRow = totalRow,
                TotalPage = (int)Math.Ceiling((double)totalRow / pageSize)
            };

            return Ok(pagination);
        }

        // POST api/<RolesController>
        [HttpPost]
        public async Task<IActionResult> Post([FromForm] RoleCreateRequest request)
        {
            var role = new IdentityRole()
            {
                Id = Guid.NewGuid().ToString(),
                Name = request.Name,
                NormalizedName = request.Name.ToUpper()
            };
            //entity.Id = await _sequenceService.GetNewId();
            var result = await _roleManager.CreateAsync(role);
            if (result.Succeeded)
            {
                return CreatedAtAction(nameof(Get), new { id = role.Id }, request);
            }
            return BadRequest(new ApiBadRequestResponse(result));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] RoleCreateRequest request)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
                return NotFound(new ApiNotFoundResponse($"Cannot find role with id {id}"));
            role.Name = request.Name;
            role.NormalizedName = request.NormalizedName;
            var result = await _roleManager.UpdateAsync(role);

            if (result.Succeeded)
            {
                return NoContent();
            }
            return BadRequest(new ApiBadRequestResponse(result));
        }

        // DELETE api/<RolesController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var role = await _roleManager.FindByIdAsync(id.ToString());
            if (role == null)
                return NotFound(new ApiNotFoundResponse($"Cannot find role with id {id}"));
            var result = await _roleManager.DeleteAsync(role);
            if (result.Succeeded)
                return NoContent();
            return BadRequest(new ApiBadRequestResponse(result));
        }

        [HttpGet("{roleId}/permissions")]
        public async Task<IActionResult> GetPermissionByRoleId(string roleId)
        {
            var permissions = from p in _context.Permissions

                              join a in _context.Commands
                              on p.CommandId equals a.Id
                              where p.RoleId == roleId
                              select new PermissionVm()
                              {
                                  FunctionId = p.FunctionId,
                                  ActionId = p.CommandId,
                                  RoleId = p.RoleId
                              };

            return Ok(await permissions.ToListAsync());
        }

        [HttpPut("{roleId}/permissions")]
        [ApiValidationFilter]
        public async Task<IActionResult> PutPermissionByRoleId(string roleId, [FromBody] UpdatePermissionRequest request)
        {
            //create new permission list from user changed
            var newPermissions = new List<Permission>();
            foreach (var p in request.Permissions)
            {
                newPermissions.Add(new Permission(p.FunctionId, roleId, p.ActionId));
            }
            var existingPermissions = _context.Permissions.Where(x => x.RoleId == roleId);

            _context.Permissions.RemoveRange(existingPermissions);
            _context.Permissions.AddRange(newPermissions.Distinct(new MyPermissionComparer()));
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return NoContent();
            }

            return BadRequest(new ApiBadRequestResponse("Save permission failed"));
        }

        internal class MyPermissionComparer : IEqualityComparer<Permission>
        {
            // Items are equal if their ids are equal.
            public bool Equals(Permission x, Permission y)
            {
                // Check whether the compared objects reference the same data.
                if (Object.ReferenceEquals(x, y)) return true;

                // Check whether any of the compared objects is null.
                if (Object.ReferenceEquals(x, null) || Object.ReferenceEquals(y, null))
                    return false;

                //Check whether the items properties are equal.
                return x.CommandId == y.CommandId && x.FunctionId == x.FunctionId && x.RoleId == x.RoleId;
            }

            // If Equals() returns true for a pair of objects
            // then GetHashCode() must return the same value for these objects.

            public int GetHashCode(Permission permission)
            {
                //Check whether the object is null
                if (Object.ReferenceEquals(permission, null)) return 0;

                //Get hash code for the ID field.
                int hashProductId = (permission.CommandId + permission.FunctionId + permission.RoleId).GetHashCode();

                return hashProductId;
            }
        }
    }
}