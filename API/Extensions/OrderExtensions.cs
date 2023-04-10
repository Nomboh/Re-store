using API.DTO;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class OrderExtensions
    {
        public static IQueryable<OrderDto> ProjectOrderToOrderDto(this IQueryable<Order> query)
        {
            return query.Select(order => new OrderDto
            {
                Id = order.Id,
                BuyerId = order.BuyerId,
                DeliveryFee = order.DeliveryFee,
                OrderDate = order.OrderDate,
                OrderStatus = order.OrderStatus.ToString(),
                ShippingAddress = order.ShippingAddress,
                SubTotal = order.SubTotal,
                Total = order.GetTotal(),
                OrderItems = order.OrderItems.Select(orderItem => new OrderItemDto
                {
                    Name = orderItem.ItemOrdered.Name,
                    PictureUrl = orderItem.ItemOrdered.PictureUrl,
                    Price = orderItem.Price,
                    ProductId = orderItem.ItemOrdered.ProductId,
                    Quantity = orderItem.Quantity
                }).ToList(),
            }).AsNoTracking();
        }
    }
}