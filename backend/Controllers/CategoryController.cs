using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using QRMenuAPI.Models;

namespace QRMenuAPI.Controllers
{    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    [Produces("application/json")]
    public class CategoryController : ControllerBase
    {
        private readonly QRMenuDbContext _context;
        public CategoryController(QRMenuDbContext context)
        {
            _context = context;
        }

        // GET: api/category
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            try 
            {
                return await _context.Categories.ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kategoriler alınırken bir hata oluştu", error = ex.Message });
            }
        }

        // GET: api/category/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);
                if (category == null)
                {
                    return NotFound(new { message = "Kategori bulunamadı" });
                }
                return category;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kategori alınırken bir hata oluştu", error = ex.Message });
            }
        }

        // POST: api/category
        [HttpPost]
        public async Task<ActionResult<Category>> PostCategory([FromBody] Category category)
        {
            try
            {
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetCategories), new { id = category.Id }, category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kategori eklenirken bir hata oluştu", error = ex.Message });
            }
        }

        // PUT: api/category/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] Category category)
        {
            try
            {
                if (id != category.Id)
                {
                    return BadRequest(new { message = "Kategori ID'leri eşleşmiyor" });
                }

                _context.Entry(category).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
                {
                    return NotFound(new { message = "Kategori bulunamadı" });
                }
                throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kategori güncellenirken bir hata oluştu", error = ex.Message });
            }
        }

        // DELETE: api/category/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);
                if (category == null)
                {
                    return NotFound(new { message = "Kategori bulunamadı" });
                }

                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kategori silinirken bir hata oluştu", error = ex.Message });
            }
        }

        private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.Id == id);
        }
    }
}
