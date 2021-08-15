using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TechWorld.BackendServer.Data.Entities.Contents
{
    [Table("Specifications")]
    public class Specification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

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

        public int ProductId { get; set; }

        [ForeignKey("ProductId")]
        public Product Product { get; set; }
    }
}
