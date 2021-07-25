using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using TechWorld.BackendServer.Data;
using TechWorld.BackendServer.Data.Entities.Systems;
using TechWorld.BackendServer.Helpers;
using TechWorld.ViewModels;
using TechWorld.ViewModels.Systems;

namespace TechWorld.BackendServer.Controllers
{
    public class UsersController : BaseController
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;

        public UsersController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var users = _userManager.Users;
            var UserVms = await users.Select(u => new UserVm()
            {
                Id = u.Id,
                UserName = u.UserName,
                Dob = u.Dob,
                Email = u.Email,
                PhoneNumber = u.PhoneNumber,
                FirstName = u.FirstName,
                LastName = u.LastName
            }).ToListAsync();
            return Ok(UserVms);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());

            if (user == null)
            {
                return NotFound();
            }
            var userVm = new UserVm()
            {
                Id = user.Id,
                UserName = user.UserName,
                Dob = user.Dob,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                FirstName = user.FirstName,
                LastName = user.LastName
            };
            return Ok(userVm);
        }

        [HttpGet("filter")]
        public async Task<IActionResult> GetPaging(string filter, int pageIndex, int pageSize)
        {
            var query = _userManager.Users.AsQueryable();
            if (!string.IsNullOrEmpty(filter))
            {
                query = query.Where(x => x.Email.Contains(filter) || x.PhoneNumber.Contains(filter) || x.UserName.Contains(filter));
            }
            var totalRow = await query.CountAsync();

            var items = await query
                .Take((pageIndex - 1) * pageSize)
                .Select(u => new UserVm()
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    Dob = u.Dob,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    FirstName = u.FirstName,
                    LastName = u.LastName
                })
                .Skip(pageSize).ToListAsync();

            var pagination = new Pagination<UserVm>()
            {
                Items = items,
                TotalRow = totalRow,
                TotalPage = (int)Math.Ceiling((double)totalRow / pageSize)
            };

            return Ok(pagination);
        }

        // POST api/<UsersController>
        [HttpPost]
        public async Task<IActionResult> Post([FromForm] UserCreateRequest request)
        {
            var user = new User()
            {
                Id = Guid.NewGuid().ToString(),
                Email = request.Email,
                Dob = request.Dob,
                UserName = request.UserName,
                LastName = request.LastName,
                FirstName = request.FirstName,
                PhoneNumber = request.PhoneNumber
            };
            var result = await _userManager.CreateAsync(user, request.Password);
            if (result.Succeeded)
            {
                return CreatedAtAction(nameof(Get), new { id = user.Id }, request);
            }
            return BadRequest(new ApiBadRequestResponse(result));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id, [FromBody] UserCreateRequest request)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
                return NotFound("Không tìm thấy user");

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Dob = request.Dob;

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return NoContent();
            }
            return BadRequest(new ApiBadRequestResponse(result));
        }

        [HttpPut("{id}/change-password")]
        public async Task<IActionResult> PutPassword(string id, [FromBody] UserPasswordChangeRequest request)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound(new ApiNotFoundResponse($"Cannot find user with id {id}"));
            var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
            if (result.Succeeded)
            {
                return NoContent();
            }
            return BadRequest(new ApiBadRequestResponse(result));
        }

        // DELETE api/<UsersController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
                return NotFound(new ApiNotFoundResponse($"Cannot find user with id {id}"));
            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
                return NoContent();
            return BadRequest(new ApiBadRequestResponse(result));
        }

        [HttpGet("{userId}/menu")]
        public async Task<IActionResult> GetMenuByUserPermission(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            var role = await _userManager.GetRolesAsync(user);
            var query = from f in _context.Functions
                        join p in _context.Permissions on f.Id equals p.FunctionId
                        join r in _roleManager.Roles on p.RoleId equals r.Id
                        join a in _context.Commands on p.CommandId equals a.Id
                        where role.Contains(r.Name) && a.Id == "VIEW"
                        select new FunctionVm()
                        {
                            Id = f.Id,
                            Name = f.Name,
                            ParentId = f.ParentId,
                            SortOrder = f.SortOrder,
                            Url = f.Url
                        };
            var data = await query.Distinct()
                .OrderBy(x => x.ParentId)
                .ThenBy(x => x.SortOrder)
                .ToListAsync();
            return Ok(data);
        }
    }
}