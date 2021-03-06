using System;
using TechWorld.ViewModels.Contants;

namespace TechWorld.ViewModels.Systems
{
    public class UserCreateRequest
    {
        public string Id { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public string FullName { get; set; }

        public string RoleId { get; set; }

        public DateTime Dob { get; set; }
    }
}