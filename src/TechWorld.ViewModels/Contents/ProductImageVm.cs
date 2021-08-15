using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TechWorld.ViewModels.Contents
{
    public class ProductImageVm
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public string[] Path { get; set; }

        public string[] Caption { get; set; }

        public string DefaultPath { get; set; }

        public DateTime DateCreated { get; set; }
    }
}
