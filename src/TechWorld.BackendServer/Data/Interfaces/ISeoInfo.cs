using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TechWorld.BackendServer.Data.Interfaces
{
    public interface ISeoInfo
    {
        string SeoAlias { get; set; }

        string SeoTitle { get; set; }

        string SeoKeyword { get; set; }

        string SeoDescription { get; set; }
    }
}
