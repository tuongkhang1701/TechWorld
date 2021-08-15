using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TechWorld.ViewModels.Contents
{
    public class CategoryVm
    {
        public int Id { get; set; }

        [StringLength(50, ErrorMessage = "Tên dài tối đa 50 kí tự")]
        [Required]
        public string Name { get; set; }


        public int SortOrder { get; set; }

        public string SeoAlias { get; set; }
        public string SeoTitle { get; set; }
        public string SeoKeyword { get; set; }
        public string SeoDescription { get; set; }
    }
}
