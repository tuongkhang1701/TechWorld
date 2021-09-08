using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using TechWorld.BackendServer.Data.Entities.Systems;

namespace TechWorld.BackendServer.Data.Entities.Contents
{
    [Table("Addresses")]
    public class Address
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [StringLength(50)]
        public string FullName { get; set; }

        [StringLength(20)]
        public string Phone { get; set; }

        public string ProvinceName { get; set; }

        public string DistrictName { get; set; }

        public string WardName { get; set; }
  
        [StringLength(50)]
        public string StreetAddress { get; set; }
        
        [StringLength(255)]
        public string FullStreetAddress { get; set; }

        [DefaultValue(false)]
        public bool IsDefault { get; set; }

        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
