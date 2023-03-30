namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public List<BasketItems> Items { get; set; } = new();

        public void AddItem(Product product, int quantity)
        {
            if (Items.All(item => item.productId != product.Id))
            {
                Items.Add(new BasketItems { Quantity = quantity, Product = product });
            }

            var existingItems = Items.FirstOrDefault(item => item.productId == product.Id);

            if (existingItems != null) existingItems.Quantity += quantity;

        }

        public void RemoveItem(int productId, int quantity)
        {
            var item = Items.FirstOrDefault(item => item.productId == productId);

            if (item == null) return;
            item.Quantity -= quantity;

            if (item.Quantity == 0) Items.Remove(item);

        }

    }
}