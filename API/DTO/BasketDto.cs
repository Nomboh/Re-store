namespace API.DTO
{
    public class BasketDto
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public ICollection<BasketItemDto> Items { get; set; }
    }
}