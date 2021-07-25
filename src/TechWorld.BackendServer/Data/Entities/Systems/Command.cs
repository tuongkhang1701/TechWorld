using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TechWorld.BackendServer.Data.Entities.Systems
{
    [Table("Commands")]
    public class Command
    {
        [Key]
        public string Id { get; set; }

        [StringLength(20)]
        public string Name { get; set; }

        public virtual ICollection<CommandFunction> CommandFunctions { get; set; }
    }
}
