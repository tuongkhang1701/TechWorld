using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TechWorld.BackendServer.Data.Entities.Contents
{
    [Table("Brands")]
    public class Brand
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [StringLength(50, ErrorMessage = "Tên dài tối đa 50 kí tự")]
        [Required]
        public string Name { get; set; }

        [StringLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string CssClass { get; set; }

        public int CategoryId { get; set; }

        public virtual ICollection<ProductCategory> ProductCategories { get; set; }
    }
}
