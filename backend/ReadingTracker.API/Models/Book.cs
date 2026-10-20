namespace ReadingTracker.API.Models;

public class Book
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Author { get; set; }
    public int TotalPages { get; set; }
    public string? CoverImageUrl { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public ICollection<ReadingLog> ReadingLogs { get; set; } = new List<ReadingLog>();
}