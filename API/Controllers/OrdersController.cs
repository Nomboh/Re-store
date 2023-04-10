using API.Data;
using API.DTO;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly StoreContext _context;
        public OrdersController(StoreContext context)
        {
            _context = context;

        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            return await _context.Orders
                .ProjectOrderToOrderDto()
                .Where(x => x.BuyerId == User.Identity.Name).ToListAsync();
        }

        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            return await _context.Orders
                .ProjectOrderToOrderDto()
                .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
                .FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto orderDto)
        {
            var basket = await _context.Baskets.RetrieveBasketWithItems(User.Identity.Name).FirstOrDefaultAsync();

            if (basket == null) return BadRequest(new ProblemDetails { Title = "Could not locate basket" });

            var Items = new List<OrderItem>();
            foreach (var item in basket.Items)
            {
                var productItem = await _context.Products.FindAsync(item.productId);
                var itemOrdered = new ProductItemOrdered
                {
                    Name = productItem.Name,
                    PictureUrl = productItem.PictureUrl,
                    ProductId = productItem.Id
                };
                var orderItems = new OrderItem
                {
                    ItemOrdered = itemOrdered,
                    Price = productItem.Price,
                    Quantity = item.Quantity
                };

                Items.Add(orderItems);
                productItem.QuantityInStock -= item.Quantity;
            }

            var subTotal = Items.Sum(item => item.Price * item.Quantity);
            var deliveryFee = subTotal > 10000 ? 0 : 500;

            var order = new Order
            {
                OrderItems = Items,
                BuyerId = User.Identity.Name,
                DeliveryFee = deliveryFee,
                ShippingAddress = orderDto.ShippingAddress,
                SubTotal = subTotal
            };

            _context.Orders.Add(order);
            _context.Baskets.Remove(basket);

            if (orderDto.SaveAddress)
            {
                var user = await _context.Users.Include(x => x.Address).FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
                var userAddress = new UserAddress
                {
                    FullName = order.ShippingAddress.FullName,
                    Address1 = order.ShippingAddress.Address1,
                    Address2 = order.ShippingAddress.Address2,
                    City = order.ShippingAddress.City,
                    Country = order.ShippingAddress.Country,
                    State = order.ShippingAddress.State,
                    Zip = order.ShippingAddress.Zip,
                };

                user.Address = userAddress;
            }

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetOrder", new { id = order.Id }, order.Id);

            return BadRequest("Problem Creating Order");
        }
    }
}