using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TechWorld.BackendServer.Data.Entities.Contents
{
    [Table("OrderDetails")]
    public class OrderDetail
    {
        public Guid OrderId { get; set; }

        public string ProductName { get; set; }

        public string Image { get; set; }

        public int ProductId { get; set; }

        public int Quantity { set; get; }

        public float PromotionPrice{ set; get; }

        public float Price { get; set; }

        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }
    }
}
