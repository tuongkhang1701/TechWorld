﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TechWorld.ViewModels.Contents
{
    public class BrandCreateRequest
    {
        public string Name { get; set; }
        public int Id { get; set; }


        public int CategoryId { get; set; }
    }
}
