using API.Data;
using API.DTO;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;
        public BasketController(StoreContext context)
        {
            _context = context;

        }
        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            Basket basket = await ExtractBasket();
            BasketDto basketDto = MapBasketDto(basket);

            if (basket == null) return NotFound();

            return basketDto;
        }


        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddBasket(int productId, int quantity)
        {
            //get basket / create basket
            var basket = await ExtractBasket();
            if (basket == null) basket = CreateBasket();
            //get product
            var product = await _context.Products.FirstOrDefaultAsync(x => x.Id == productId);
            if (product == null) return NotFound();

            //add item
            basket.AddItem(product, quantity);
            //save changes
            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetBasket", MapBasketDto(basket));
            return BadRequest(new ProblemDetails { Title = "We could not add your item to the basket" });


        }



        [HttpDelete]
        public async Task<ActionResult> RemoveBasket(int productId, int quantity)
        {
            //get basket
            var basket = await ExtractBasket();

            if (basket == null) return NotFound();

            //remove items or reduce
            basket.RemoveItem(productId, quantity);

            //save changes
            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();
            return BadRequest(new ProblemDetails { Title = "could not remove item from basket" });
        }

        private async Task<Basket> ExtractBasket()
        {
            return await _context.Baskets
            .Include(x => x.Items)
            .ThenInclude(x => x.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
        }

        private Basket CreateBasket()
        {
            var buyerId = Guid.NewGuid().ToString();

            var cookieOptions = new CookieOptions
            {
                IsEssential = true,
                Expires = DateTime.Now.AddDays(30),

            };
            Response.Cookies.Append("buyerId", buyerId);

            var basket = new Basket { BuyerId = buyerId };

            _context.Baskets.Add(basket);
            return basket;
        }

        private static BasketDto MapBasketDto(Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(b => new BasketItemDto
                {
                    Brand = b.Product.Brand,
                    Name = b.Product.Brand,
                    Price = b.Product.Price,
                    PictureUrl = b.Product.PictureUrl,
                    Type = b.Product.Type,
                    Quantity = b.Quantity,
                    ProductId = b.productId,
                }).ToList()
            };
        }

    }
}