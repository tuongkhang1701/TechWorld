using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TechWorld.ViewModels.Contants;

namespace TechWorld.ViewModels.Contents
{
    public class OrderVm
    {
        public string Id { get; set; }

        public string CustomerId { get; set; }

        public string CustomerName { get; set; }

        public string CustomerAddress { get; set; }

        public string CustomerEmail { get; set; }

        public string CustomerPhone { get; set; }

        public string PaymentMethodId { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public StatusOrder Status { get; set; }

        public List<OrderDetailVm> OrderDetails { get; set; }
    }
}
