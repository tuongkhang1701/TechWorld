using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TechWorld.ViewModels
{
    public class UploadedFile
    {
        public string UploadName { get; set; }
        public IFormFile Files { get; set; }
    }
}
