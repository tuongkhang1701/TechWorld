using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TechWorld.ViewModels.Contants;

namespace TechWorld.ViewModels.Systems
{
    public class UserVm
    {
        public string Id { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public string FullName { get; set; }

        public string Dob { get; set; }

        public string DateCreated { get; set; }

        public string? DateUpdated { get; set; }

        public RoleVm Role { get; set; }
    }
}
