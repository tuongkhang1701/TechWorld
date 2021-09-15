using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using TechWorld.BackendServer.Helpers;
using TechWorld.ViewModels;

namespace TechWorld.BackendServer.Controllers
{

    public class UploadsController : BaseController
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        public UploadsController(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost("upload-image")]
        public IActionResult UploadImage([FromForm] UploadedFile uploadedFile)
        {
            try
            {
                DateTime now = DateTime.Now;
                var files = HttpContext.Request.Form.Files;
                if (files.Count == 0)
                {
                    return NoContent();
                }
                else
                {
                    foreach (var item in files)
                    {
                        var file = item;
                        var fileName = ContentDispositionHeaderValue
                            .Parse(file.ContentDisposition)
                            .FileName
                            .Trim('"');

                        var imageFolder = $@"\uploaded\images\{now.ToString("yyyyMMdd")}";

                        string folder = _webHostEnvironment.WebRootPath + imageFolder;

                        if (!Directory.Exists(folder))
                            Directory.CreateDirectory(folder);

                        string filePath = Path.Combine(folder, fileName);
                        using (FileStream fs = System.IO.File.Create(filePath))
                        {
                            file.CopyTo(fs);
                            fs.Flush();
                        };
                    }

                    return NoContent();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiBadRequestResponse(ex.ToString()));
            }

        }
    }
}
