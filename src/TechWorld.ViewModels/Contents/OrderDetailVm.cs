using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TechWorld.ViewModels.Contents
{
    public class OrderDetailVm
    {
        public string OrderId { get; set; }

        public string ProductName { get; set; }

        public string Image { get; set; }

        public int ProductId { get; set; }

        public int Quantity { set; get; }

        public float PromotionPrice { set; get; }

        public float Price { get; set; }
    }
}
