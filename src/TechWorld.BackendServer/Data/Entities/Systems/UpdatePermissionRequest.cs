using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TechWorld.BackendServer.Data.Entities.Systems
{
    public class UpdatePermissionRequest
    {
        public List<PermissionVm> Permissions { get; set; } = new List<PermissionVm>();
    }
}
