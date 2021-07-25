using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TechWorld.ViewModels
{
    public class Pagination<T>
    {
        public List<T> Items { get; set; }

        public int TotalRow { get; set; }

        public int TotalPage { get; set; }

        public int PageIndex { get; set; }

        public int PageSize { get; set; }
    }
}
