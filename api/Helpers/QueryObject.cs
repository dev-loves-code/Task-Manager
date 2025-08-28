using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Helpers
{
    public class QueryObject
    {
        public string? Title { get; set; }
        public bool? IsCompleted { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
    }
}