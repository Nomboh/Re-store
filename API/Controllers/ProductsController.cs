
using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _context;
        public ProductsController(StoreContext context)
        {
            _context = context;

        }

        [HttpGet]
        public async Task<ActionResult<PageList<Product>>> GetProducts([FromQuery]
         ProductParams productParams)
        {
            var query = _context.Products
                .Sort(productParams.OrderBy)
                .Search(productParams.SearchTerm)
                .Filter(productParams.Types, productParams.Brands)
                .AsQueryable();

            var products = await PageList<Product>.ToPageList(query,
             productParams.PageNumber, productParams.PageSize);
            Response.AddPaginationHeader(products.MetaData);

            return products;
        }

        [HttpGet("{id}")]  // api/products/id
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            return await _context.Products.FindAsync(id);
        }


        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var types = await _context.Products.Select(x => x.Type).Distinct().ToListAsync();
            var brands = await _context.Products.Select(x => x.Brand).Distinct().ToListAsync();
            return Ok(new { brands, types });
        }

    }
}