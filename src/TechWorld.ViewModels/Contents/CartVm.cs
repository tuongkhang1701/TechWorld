using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TechWorld.ViewModels.Contents
{
    public class CartVm
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public ProductVm Product { get; set; }

        public int Quantity { get; set; }
    }
}
