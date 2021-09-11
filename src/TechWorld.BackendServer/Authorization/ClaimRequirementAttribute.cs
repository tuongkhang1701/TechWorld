using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TechWorld.BackendServer.Constants;

namespace TechWorld.BackendServer.Authorization
{
    public class ClaimRequirementAttribute : TypeFilterAttribute
    {
        public ClaimRequirementAttribute(string claimType, string claimValue) 
            : base(typeof(ClaimRequirementFilter))
        {
            Arguments = new object[] { new Claim( claimType, claimValue) };
        }
    }
}
