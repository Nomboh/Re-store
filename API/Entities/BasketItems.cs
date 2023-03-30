

namespace API.Entities
{

    public class BasketItems
    {
        public int Id { get; set; }
        public int Quantity { get; set; }

        public int productId { get; set; }
        public Product Product { get; set; }

        public int BasketId { get; set; }
        public Basket Basket { get; set; }
    }
}