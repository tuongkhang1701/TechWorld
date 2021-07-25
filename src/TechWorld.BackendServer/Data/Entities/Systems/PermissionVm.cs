using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TechWorld.BackendServer.Data.Entities.Systems
{
    public class PermissionVm
    {
        public string FunctionId { get; set; }

        public string RoleId { get; set; }

        public string ActionId { get; set; }
    }
}
