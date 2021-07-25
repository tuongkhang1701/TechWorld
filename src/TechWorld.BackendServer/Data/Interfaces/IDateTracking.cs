using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TechWorld.BackendServer.Data.Interfaces
{
    public interface IDateTracking
    {
        DateTime CreatedDate { get; set; }

        DateTime? UpdatedDate { get; set; }
    }
}
