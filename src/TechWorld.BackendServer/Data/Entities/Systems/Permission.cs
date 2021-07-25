using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TechWorld.BackendServer.Data.Entities.Systems
{
    public class Permission
    {
        public Permission()
        {
        }
        public Permission(string functionId, string roleId, string commandId)
        {
            FunctionId = functionId;
            CommandId = commandId;
            RoleId = roleId;
        }
        public string FunctionId { get; set; }

        public string CommandId { get; set; }

        public string RoleId { get; set; }

        [ForeignKey("FunctionId")]
        public virtual Function Function { get; set; }

        [ForeignKey("CommandId")]
        public virtual Command Command { get; set; }

        [ForeignKey("RoleId")]
        public virtual IdentityRole Role { get; set; }
    }
}
