using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TechWorld.BackendServer.Data;
using TechWorld.BackendServer.Data.Entities.Contents;
using TechWorld.BackendServer.Data.Entities.Systems;
using TechWorld.BackendServer.Extensions;
using TechWorld.BackendServer.Helpers;
using TechWorld.ViewModels;
using TechWorld.ViewModels.Systems;
using static Dapper.SqlMapper;

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
                Dob = u.Dob.ToString("dd/mm/yyyy"),
                Email = u.Email,
                PhoneNumber = u.PhoneNumber,
                FullName = u.FullName,
                DateCreated = u.DateCreated.ToString("dd/MM/yyyy HH:mm"),
                DateUpdated = u.DateUpdated.Value.ToString("dd/MM/yyyy HH:mm")
            }).ToListAsync();
            return Ok(UserVms);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            try
            {
                var user = await (from u in _userManager.Users
                            join ur in _context.UserRoles on u.Id equals ur.UserId
                            join r in _roleManager.Roles on ur.RoleId equals r.Id
                            select new UserVm()
                            {
                                Id = u.Id,
                                UserName = u.UserName,
                                Dob = u.Dob.ToString("dd/MM/yyyy"),
                                Email = u.Email,
                                PhoneNumber = u.PhoneNumber,
                                FullName = u.FullName,
                                DateCreated = u.DateCreated.ToString("dd/MM/yyyy HH:mm"),
                                DateUpdated = u.DateUpdated.Value.ToString("dd/MM/yyyy HH:mm"),
                                Role = new RoleVm()
                                {
                                    Id = r.Id,
                                    Name = r.Name
                                }
                            }).Where(x => x.Id == id).SingleOrDefaultAsync();
                           

                if (user == null)
                {
                    return NotFound(new ApiNotFoundResponse($"Cannot find user with id {id}"));
                }
                /*var userVm = new UserVm()
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Dob = user.Dob.ToString("yyyy-MM-dd"),
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    FullName = user.FullName,
                    DateCreated = user.DateCreated.ToString("dd/MM/yyyy HH:mm"),
                    DateUpdated = user.DateUpdated.HasValue ? user.DateUpdated.Value.ToString("dd/MM/yyyy HH:mm") : null
                };*/
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiBadRequestResponse(ex.ToString()));
            }

        }

        [HttpPost("pagination")]
        public async Task<IActionResult> GetPaging([FromBody] PaginationRequest request)
        {
            var query = (from u in _userManager.Users
                           join ur in _context.UserRoles on u.Id equals ur.UserId
                           join r in _roleManager.Roles on ur.RoleId equals r.Id
                           select new UserVm()
                           {
                               Id = u.Id,
                               UserName = u.UserName,
                               Dob = u.Dob.ToString("dd/MM/yyyy"),
                               Email = u.Email,
                               PhoneNumber = u.PhoneNumber,
                               FullName = u.FullName,
                               DateCreated = u.DateCreated.ToString("dd/MM/yyyy HH:mm"),
                               DateUpdated = u.DateUpdated.Value.ToString("dd/MM/yyyy HH:mm"),
                               Role = new RoleVm()
                               {
                                   Id = r.Id,
                                   Name = r.Name
                               }
                           }).AsQueryable();
            if (!string.IsNullOrEmpty(request.Keyword))
            {
                query = query.Where(x => x.Email.Contains(request.Keyword) || x.PhoneNumber.Contains(request.Keyword) || x.UserName.Contains(request.Keyword));
            }
            var totalRow = await query.CountAsync();

            var items = await query
                .Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize).ToListAsync();
            var pagination = new Pagination<UserVm>()
            {
                Items = items,
                TotalRow = totalRow,
                TotalPage = (int)Math.Ceiling((double)totalRow / request.PageSize),
                PageIndex = request.PageIndex,
                PageSize = request.PageSize
            };

            return Ok(pagination);
        }

        // POST api/<UsersController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] UserCreateRequest request)
        {
            try
            {
                var user = new User()
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = request.Email,
                    Dob = request.Dob,
                    UserName = request.UserName,
                    FullName = request.FullName,
                    PhoneNumber = request.PhoneNumber,
                    DateCreated = DateTime.Now
                };
                var result = await _userManager.CreateAsync(user, request.Password);
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, request.RoleId);
                    return NoContent();
                }
                return BadRequest(new ApiBadRequestResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiBadRequestResponse(ex.ToString()));
            }

        }

        [HttpPost("{username}")]
        public async Task<IActionResult> CheckUsername(string username)
        {
            var existed = await _userManager.FindByNameAsync(username);
            if (existed != null)
                return BadRequest(new BadRequestObjectResult("Username has existed"));
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id, [FromBody] UserCreateRequest request)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
                return NotFound(new ApiNotFoundResponse($"Cannot find user with id {id}"));

            user.FullName = request.FullName;
            user.Dob = request.Dob;
            user.DateUpdated = DateTime.Now;

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                var existed = await _context.UserRoles.Where(x => x.UserId == request.Id).SingleOrDefaultAsync();
                if (existed.RoleId != request.RoleId)
                {
                    _context.UserRoles.Remove(existed);
                    await _userManager.AddToRoleAsync(user, request.RoleId);
                }
                return NoContent();
            }
            return BadRequest(new ApiBadRequestResponse(result));
        }
        
        [HttpPut("change-password")]
        public async Task<IActionResult> PutPassword([FromBody] UserPasswordChangeRequest request)
        {
            var userId = User.GetSpecificClaim(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound(new ApiNotFoundResponse($"Cannot find user with id {userId}"));
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
            var userRole = await _context.UserRoles.Where(x => x.UserId == id).SingleOrDefaultAsync();
            _context.UserRoles.Remove(userRole);
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