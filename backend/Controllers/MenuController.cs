using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using QRMenuAPI.Models;

namespace QRMenuAPI.Controllers
{    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    [Produces("application/json")]
    public class MenuController : ControllerBase
    {
        private readonly QRMenuDbContext _context;
        public MenuController(QRMenuDbContext context)
        {
            _context = context;
        }        // GET: api/menu
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuItem>>> GetMenuItems()
        {
            try
            {
                var items = await _context.MenuItems
                    .Include(m => m.Category)
                    .ToListAsync();

                // Debug için konsola yazdıralım
                foreach (var item in items)
                {
                    Console.WriteLine($"Menu Item: {item.Name}, Category: {item.Category?.Name}");
                }

                Response.Headers.Add("Content-Type", "application/json; charset=utf-8");
                return items;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetMenuItems: {ex.Message}");
                return StatusCode(500, new { message = "Menü öğeleri alınırken bir hata oluştu", error = ex.Message });
            }
        }

        // GET: api/menu/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MenuItem>> GetMenuItem(int id)
        {
            try
            {
                var item = await _context.MenuItems
                    .Include(m => m.Category)
                    .FirstOrDefaultAsync(m => m.Id == id);

                if (item == null)
                    return NotFound(new { message = "Menü öğesi bulunamadı" });

                return item;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Menü öğesi alınırken bir hata oluştu", error = ex.Message });
            }
        }

        // GET: api/menu/category/{categoryId}
        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<MenuItem>>> GetMenuItemsByCategory(int categoryId)
        {
            try
            {
                return await _context.MenuItems
                    .Include(m => m.Category)
                    .Where(m => m.CategoryId == categoryId)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kategori menü öğeleri alınırken bir hata oluştu", error = ex.Message });
            }
        }

        // POST: api/menu
        [HttpPost]
        public async Task<ActionResult<MenuItem>> PostMenuItem([FromBody] MenuItem item)
        {
            try
            {
                var category = await _context.Categories.FindAsync(item.CategoryId);
                if (category == null)
                {
                    return BadRequest(new { message = "Geçersiz kategori ID" });
                }

                _context.MenuItems.Add(item);
                await _context.SaveChangesAsync();
                
                // Load the category before returning
                await _context.Entry(item)
                    .Reference(i => i.Category)
                    .LoadAsync();

                return CreatedAtAction(nameof(GetMenuItem), new { id = item.Id }, item);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Menü öğesi eklenirken bir hata oluştu", error = ex.Message });
            }
        }

        // PUT: api/menu/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMenuItem(int id, [FromBody] MenuItem item)
        {
            try
            {
                if (id != item.Id)
                    return BadRequest(new { message = "Menü öğesi ID'leri eşleşmiyor" });

                var category = await _context.Categories.FindAsync(item.CategoryId);
                if (category == null)
                {
                    return BadRequest(new { message = "Geçersiz kategori ID" });
                }

                _context.Entry(item).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.MenuItems.Any(e => e.Id == id))
                    return NotFound(new { message = "Menü öğesi bulunamadı" });
                throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Menü öğesi güncellenirken bir hata oluştu", error = ex.Message });
            }
        }

        // DELETE: api/menu/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenuItem(int id)
        {
            try
            {
                var item = await _context.MenuItems.FindAsync(id);
                if (item == null)
                    return NotFound(new { message = "Menü öğesi bulunamadı" });

                _context.MenuItems.Remove(item);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Menü öğesi silinirken bir hata oluştu", error = ex.Message });
            }
        }

        // GEÇİCİ: Duplicate MenuItem kayıtlarını silen endpoint
        [HttpPost("fix-duplicates")]
        public async Task<IActionResult> FixDuplicates()
        {
            var duplicates = _context.MenuItems
                .GroupBy(m => m.Id)
                .Where(g => g.Count() > 1)
                .SelectMany(g => g.Skip(1))
                .ToList();

            _context.MenuItems.RemoveRange(duplicates);
            await _context.SaveChangesAsync();
            return Ok(new { message = $"{duplicates.Count} duplicate MenuItems removed." });
        }

        // GEÇİCİ: Duplicate Category kayıtlarını silen endpoint
        [HttpPost("fix-category-duplicates")]
        public async Task<IActionResult> FixCategoryDuplicates()
        {
            var duplicates = _context.Categories
                .GroupBy(c => c.Id)
                .Where(g => g.Count() > 1)
                .SelectMany(g => g.Skip(1))
                .ToList();

            _context.Categories.RemoveRange(duplicates);
            await _context.SaveChangesAsync();
            return Ok(new { message = $"{duplicates.Count} duplicate Categories removed." });
        }

        // GEÇİCİ: Duplicate Order kayıtlarını silen endpoint
        [HttpPost("fix-order-duplicates")]
        public async Task<IActionResult> FixOrderDuplicates()
        {
            var duplicates = _context.Orders
                .GroupBy(o => o.Id)
                .Where(g => g.Count() > 1)
                .SelectMany(g => g.Skip(1))
                .ToList();

            _context.Orders.RemoveRange(duplicates);
            await _context.SaveChangesAsync();
            return Ok(new { message = $"{duplicates.Count} duplicate Orders removed." });
        }

        // GEÇİCİ: Duplicate OrderItem kayıtlarını silen endpoint
        [HttpPost("fix-orderitem-duplicates")]
        public async Task<IActionResult> FixOrderItemDuplicates()
        {
            var duplicates = _context.OrderItems
                .GroupBy(oi => oi.Id)
                .Where(g => g.Count() > 1)
                .SelectMany(g => g.Skip(1))
                .ToList();

            _context.OrderItems.RemoveRange(duplicates);
            await _context.SaveChangesAsync();
            return Ok(new { message = $"{duplicates.Count} duplicate OrderItems removed." });
        }
    }
}
