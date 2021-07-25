using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TechWorld.BackendServer.Data.Entities.Systems
{
    [Table("Functions")]
    public class Function
    {
        [Key]
        public string Id { get; set; }

        [MaxLength(200)]
        [Required]
        public string Name { get; set; }

        [MaxLength(200)]
        [Required]
        public string Url { get; set; }

        [Required]
        public int SortOrder { get; set; }

        [MaxLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string ParentId { get; set; }

        [MaxLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string Icon { get; set; }

        public virtual ICollection<CommandFunction> CommandFunctions { get; set; }
    }
}
