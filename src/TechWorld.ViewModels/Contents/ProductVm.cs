using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TechWorld.ViewModels.Contents
{
    public class ProductVm
    {
        public int Id { get; set; }

        [StringLength(200, ErrorMessage = "Tên dài tối đa 200 kí tự")]
        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        public string Content { get; set; }

        public string DefaultImage { get; set; }


        public float? OriginalPrice { get; set; }

        public float? Price { get; set; }

        public float? PromotionPrice { get; set; }

        public int Quantity { get; set; }

        public string Image { get; set; }

        public int ViewCount { get; set; }

        public string SeoAlias { get; set; }

        public string SeoTitle { get; set; }

        public string SeoKeyword { get; set; }

        public string SeoDescription { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public int RateTotal { get; set; }

        public int RateCount { get; set; }

        public int BrandId { get; set; }

        public int CategoryId { get; set; }

        public CategoryVm Category { get; set; }

        public BrandVm Brand { get; set; }
    }
}
