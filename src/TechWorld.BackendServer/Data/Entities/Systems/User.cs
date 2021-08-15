using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using TechWorld.BackendServer.Data.Interfaces;
using TechWorld.ViewModels.Contants;

namespace TechWorld.BackendServer.Data.Entities.Systems
{
    public class User : IdentityUser
    {
        public string FullName { get; set; }

        public DateTime Dob { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime? DateUpdated { get; set; }

        public int? NumberOfExchangeBases { get; set; }

        public int? NumberOfVotes { get; set; }

        public int? NumberOfReports { get; set; }
    }
}
