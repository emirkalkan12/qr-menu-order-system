using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace QRMenuAPI.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int TableNumber { get; set; }
        
        public List<OrderItem> Items { get; set; }
        
        [Required]
        public string Status { get; set; } // beklemede, hazırlanıyor, tamamlandı, iptal edildi
        
        [Required]
        public decimal TotalAmount { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime? UpdatedAt { get; set; }
    }

    public class OrderItem
    {
        [Key]
        public int Id { get; set; }
        
        public int OrderId { get; set; }
        
        [Required]
        public int MenuItemId { get; set; }
        
        [Required]
        public string Name { get; set; }
        
        [Required]
        public int Quantity { get; set; }
        
        [Required]
        public decimal Price { get; set; }
    }
}
