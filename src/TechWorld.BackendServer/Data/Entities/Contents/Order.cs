using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using TechWorld.BackendServer.Data.Entities.Systems;
using TechWorld.BackendServer.Data.Interfaces;
using TechWorld.ViewModels.Contants;

namespace TechWorld.BackendServer.Data.Entities.Contents
{
    [Table("Orders")]
    public class Order : IDateTracking
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string CustomerId { get; set; }

        [StringLength(50)]
        public string CustomerName { get; set; }

        [StringLength(200)]
        public string CustomerAddress { get; set; }

        [StringLength(100)]
        [EmailAddress]
        public string CustomerEmail { get; set; }

        [StringLength(20)]
        public string CustomerPhone { get; set; }

        public int PaymentMethodId { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public StatusOrder Status { get; set; }

        [ForeignKey("CustomerId")]
        public virtual User User { get; set; }

        [ForeignKey("PaymentMethodId")]
        public virtual PaymentMethod PaymentMethod { get; set; }

        public virtual ICollection<OrderDetail> OrderDetails { get; set; }
    }
}
