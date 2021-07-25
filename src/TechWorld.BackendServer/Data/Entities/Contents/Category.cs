using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using TechWorld.BackendServer.Data.Interfaces;

namespace TechWorld.BackendServer.Data.Entities.Contents
{
    [Table("Categories")]
    public class Category : ISeoInfo
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [StringLength(50, ErrorMessage = "Tên dài tối đa 50 kí tự")]
        [DataType("nvarchar(50)")]
        public string Name { get; set; }

        public int? ParentId { get; set; }

        public int SortOrder { get; set; }

        public string SeoAlias { get; set; }
        public string SeoTitle { get; set; }
        public string SeoKeyword { get; set; }
        public string SeoDecription { get; set; }

        public virtual ICollection<ProductCategory> ProductCategories { get; set; }

        public virtual ICollection<BrandCategory> BrandCategories { get; set; }
    }
}
