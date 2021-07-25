using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using TechWorld.BackendServer.Data.Entities.Systems;
using TechWorld.BackendServer.Data.Interfaces;

namespace TechWorld.BackendServer.Data.Entities.Contents
{
    [Table("Announcement")]
    public class Announcement :  IDateTracking
    {
        [Key]
        public string Id { get; set; }
        [Required]
        [StringLength(250)]
        public string Title { set; get; }

        [StringLength(250)]
        public string Content { set; get; }

        public string UserId { set; get; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public DateTime CreatedDate { set; get; }
        public DateTime? UpdatedDate { set; get; }
    }
}
