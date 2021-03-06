using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using TechWorld.BackendServer.Data.Entities.Systems;
using TechWorld.BackendServer.Helpers;
using TechWorld.BackendServer.Services;
using TechWorld.ViewModels;

namespace TechWorld.BackendServer.Controllers
{
    public class AuthController : BaseController
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _configuration;

        public AuthController(UserManager<User> userManager,
            IConfiguration configuration,
            SignInManager<User> signInManager,
            RoleManager<IdentityRole> roleManager)
        {
            _configuration = configuration;
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] UserCredential request)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(request.Username);
                if (user != null && await _userManager.CheckPasswordAsync(user, request.Password))
                {
                    var userRoles = await _userManager.GetRolesAsync(user);
                    var roleName = await _userManager.GetRolesAsync(user);
                    if(roleName[0] != "Admin")
                        return Forbid();
                    var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim("FullName", user.FullName),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.MobilePhone, user.PhoneNumber),
                    new Claim(ClaimTypes.Role, roleName[0]),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                    foreach (var userRole in userRoles)
                    {
                        authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                    }

                    var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

                    var token = new JwtSecurityToken(
                        issuer: _configuration["JWT:ValidIssuer"],
                        audience: _configuration["JWT:ValidAudience"],
                        expires: DateTime.Now.AddDays(1),
                        claims: authClaims,
                        signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                        );

                    return Ok(new
                    {
                        token = new JwtSecurityTokenHandler().WriteToken(token),
                        expiration = token.ValidTo
                    });
                }
                return Unauthorized();
            }
            catch (Exception ex)
            {

                return BadRequest(new ApiBadRequestResponse(ex.ToString()));
            }

        }

        [AllowAnonymous]
        [HttpPost("authenticate-user")]
        public async Task<IActionResult> AuthenticateUser([FromBody] UserCredential request)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(request.Username);
                if (user != null && await _userManager.CheckPasswordAsync(user, request.Password))
                {
                    var userRoles = await _userManager.GetRolesAsync(user);
                    var roleName = await _userManager.GetRolesAsync(user);

                    var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim("FullName", user.FullName),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.MobilePhone, user.PhoneNumber),
                    new Claim(ClaimTypes.Role, roleName[0]),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                    foreach (var userRole in userRoles)
                    {
                        authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                    }

                    var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

                    var token = new JwtSecurityToken(
                        issuer: _configuration["JWT:ValidIssuer"],
                        audience: _configuration["JWT:ValidAudience"],
                        expires: DateTime.Now.AddDays(1),
                        claims: authClaims,
                        signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                        );

                    return Ok(new
                    {
                        user = user,
                        token = new JwtSecurityTokenHandler().WriteToken(token),
                        expiration = token.ValidTo
                    });
                }
                return Unauthorized();
            }
            catch (Exception ex)
            {

                return BadRequest(new ApiBadRequestResponse(ex.ToString()));
            }

        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterModel request)
        {
            try
            {
                var userExists = await _userManager.FindByNameAsync(request.Username);
                if (userExists != null)
                    return BadRequest(new ApiBadRequestResponse("User already exists!"));

                User user = new User()
                {
                    UserName = request.Username,
                    Email = request.Email,
                    FullName = request.FullName,
                    SecurityStamp = Guid.NewGuid().ToString()
                };

                var result = await _userManager.CreateAsync(user, request.Password);
                if (!result.Succeeded)
                    return BadRequest(new ApiBadRequestResponse("User creation failed! Please check user details and try again."));
                await _userManager.AddToRoleAsync(user, request.RoleName);
                return Ok(new ApiResponse(200, "User created successfully!"));
            }
            catch (Exception ex)
            {

                throw;
                return BadRequest(new ApiBadRequestResponse("User already exists!"));

            }

        }

        [HttpPost("register-user")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterModel request)
        {
            try
            {
                var userExists = await _userManager.FindByNameAsync(request.Username);
                if (userExists != null)
                    return BadRequest(new ApiBadRequestResponse("User already exists!"));

                User user = new User()
                {
                    UserName = request.Username,
                    Email = request.Email,
                    PhoneNumber = request.Phone,
                    FullName = request.FullName,
                    SecurityStamp = Guid.NewGuid().ToString()
                };

                var result = await _userManager.CreateAsync(user, request.Password);
                if (!result.Succeeded)
                    return BadRequest(new ApiBadRequestResponse("User creation failed! Please check user details and try again."));
                await _userManager.AddToRoleAsync(user, "Member");
                return Ok(new ApiResponse(200, "User created successfully!"));
            }
            catch (Exception ex)
            {

                throw;
                return BadRequest(new ApiBadRequestResponse("User already exists!"));

            }

        }

        [HttpPost("register-admin")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterModel request)
        {
            var userExists = await _userManager.FindByNameAsync(request.Username);
            if (userExists != null)
                return BadRequest(new ApiBadRequestResponse("User already exists!"));

            User user = new User()
            {
                Email = request.Email,
                UserName = request.Username,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user);
            if (!result.Succeeded)
                return BadRequest(new ApiBadRequestResponse("User creation failed! Please check user details and try again."));

            if (await _roleManager.RoleExistsAsync("Admin"))
                await _userManager.AddToRoleAsync(user, "Admin");

            return Ok(new ApiResponse(200, "User created successfully!"));
        }
    }
}