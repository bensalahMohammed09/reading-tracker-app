namespace ReadingTracker.API.DTOs;

public class CreateBookDto
{
    public required string Title { get; set; }
    public required string Author { get; set; }
    public int TotalPages { get; set; }
    public string? CoverImageUrl { get; set; }
}

public class BookResponseDto
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Author { get; set; }
    public int TotalPages { get; set; }
    public string? CoverImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}