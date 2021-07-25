using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TechWorld.BackendServer.Data.Entities.Contents
{
    [Table("BrandCategories")]
    public class BrandCategory
    {
        public int BrandId { get; set; }

        public int CategoryId { get; set; }

        [ForeignKey("BrandId")]
        public virtual Brand Products { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category Categories { get; set; }
    }
}
