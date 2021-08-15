using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TechWorld.BackendServer.Data.Entities.Contents;
using TechWorld.BackendServer.Data;
using TechWorld.BackendServer.Helpers;
using TechWorld.BackendServer.Services;
using TechWorld.ViewModels.Contents;
using TechWorld.ViewModels;

namespace TechWorld.BackendServer.Controllers
{
    public class AccountsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AccountsController(ApplicationDbContext context, ISequenceService sequenceService)
        {
            _context = context;
        }

        
    }
}
