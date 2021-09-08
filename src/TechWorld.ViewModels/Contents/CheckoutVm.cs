using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TechWorld.ViewModels.Contents
{
    public class CheckoutVm
    {
        public string CustomerName { get; set; }

        public string CustomerAddress { get; set; }

        public string CustomerEmail { get; set; }
        
        public string CustomerPhone { get; set; }

        public string PaymentMethodId { get; set; }
    }
}
