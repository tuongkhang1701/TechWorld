using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TechWorld.ViewModels.Contents
{
    public class BrandVm
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CssClass { get; set; }

        public CategoryVm Category { get; set; }
    }
}
