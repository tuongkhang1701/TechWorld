using System;
using System.Collections.Generic;
using System.ComponentModel;
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

        public string Image { get; set; }

        public float? OriginalPrice { get; set; }

        [DefaultValue(0)]
        public float? Price { get; set; }

        public float? PromotionPrice { get; set; }

        public int Quantity { get; set; }

        public string SeoAlias { get; set; }

        public string SeoTitle { get; set; }

        public string SeoKeyword { get; set; }

        public string SeoDescription { get; set; }

        public int BrandId { get; set; }

        public int CategoryId { get; set; }


        public string Cpu { get; set; }

        public string Ram { get; set; }

        public string Screen { get; set; }

        public string Graphic { get; set; }

        public string HardWare { get; set; }

        public string Os { get; set; }

        public double Weight { get; set; }

        public string Size { get; set; }

        public string Origin { get; set; }

        public int ReleasedYear { get; set; }
    }
}
