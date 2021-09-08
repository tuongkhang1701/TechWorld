using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TechWorld.ViewModels.Contents
{
    public class OrderCreateRequest
    {
        public int AddressId { get; set; }

        public string PaymentMethodId { get; set; }
    }
}
