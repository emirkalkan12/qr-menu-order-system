using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using QRMenuAPI.Models;

namespace QRMenuAPI.Controllers
{    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowAll")]
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
            return await _context.Categories.ToListAsync();
        }

        // POST: api/category
        [HttpPost]
        public async Task<ActionResult<Category>> PostCategory([FromBody] Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCategories), new { id = category.Id }, category);
        }
    }
}
