using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TechWorld.BackendServer.Data.Entities.Systems
{
    public class CommandFunction
    {
        public string CommandId { get; set; }

        public string FunctionId { get; set; }

        [ForeignKey("CommandId")]
        public virtual Command Command { get; set; }

        [ForeignKey("FunctionId")]
        public virtual Function Function { get; set; }
    }
}
