using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TechWorld.BackendServer.Data.Entities.Contents
{
    [Table("PaymentMethods")]
    public class PaymentMethod
    {
        [Key]
        public string Id { get; set; }

        [StringLength(100)]
        [Required]
        public string Name { get; set; }

        public int SortOrder { get; set; }
    }
}
