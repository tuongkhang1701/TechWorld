using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TechWorld.BackendServer.Data.Entities.Contents
{
    [Table("ProductCategories")]
    public class ProductCategory
    {
        public int ProductId { get; set; }

        public int CategoryId { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Products { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category Categories { get; set; }
    }
}
