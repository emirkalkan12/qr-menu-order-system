using System.ComponentModel.DataAnnotations;

namespace QRMenuAPI.Models
{
    public class MenuItem
    {        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Required]
        public decimal Price { get; set; }
        
        [Required]
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
        
        public string? ImagePath { get; set; }
        
        public bool IsAvailable { get; set; } = true;
    }
}
