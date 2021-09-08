using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TechWorld.ViewModels.Contents
{
    public class AddressCreateRequest
    {
        public int Id { get; set; }

        [StringLength(50)]
        public string FullName { get; set; }

        [StringLength(20)]
        public string Phone { get; set; }

        public string ProvinceName { get; set; }

        public string DistrictName { get; set; }

        public string WardName { get; set; }

        public string StreetAddress { get; set; }

        [DefaultValue(false)]
        public bool IsDefault { get; set; }
    }
}
