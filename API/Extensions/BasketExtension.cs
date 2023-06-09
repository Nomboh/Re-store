using API.DTO;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class BasketExtension
    {
        public static BasketDto MapBasket(this Basket basket)
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

        public static IQueryable<Basket> RetrieveBasketWithItems(this IQueryable<Basket> query, string buyerId)
        {
            return query.Include(i => i.Items).ThenInclude(p => p.Product).Where(b => b.BuyerId == buyerId);
        }
    }
}