using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TechWorld.ViewModels.Contents
{
    public class ProductCreateRequest
    {
        public int Id { get; set; }

        [StringLength(200, ErrorMessage = "Tên dài tối đa 200 kí tự")]
        public string Name { get; set; }

        public string Description { get; set; }

        public string Content { get; set; }

        public float? OriginalPrice { get; set; }

        public float? Price { get; set; }

        public float? PromotionPrice { get; set; }

        public int Quantity { get; set; }

        public string ImageUrl { get; set; }

        public string ImageList { get; set; }

        public string SeoAlias { get; set; }

        public string SeoTitle { get; set; }

        public string SeoKeyword { get; set; }

        public string SeoDecription { get; set; }

        public int BrandId { get; set; }
    }
}
