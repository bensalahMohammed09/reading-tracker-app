namespace ReadingTracker.API.Models;

public enum ReadingStatus { PlanToRead, Reading, Completed, Dropped }

public class ReadingLog
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int BookId { get; set; }
    
    // Progress Tracking
    public ReadingStatus Status { get; set; }
    public int CurrentPage { get; set; }
    
    // Memory & Retention
    public int? Rating { get; set; } // 1-5 scale
    public string? KeyTakeaways { get; set; }
    public string? PersonalNotes { get; set; }
    
    // Timelines & Auditing
    public DateTime? StartDate { get; set; }
    public DateTime? FinishDate { get; set; }
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public Book Book { get; set; } = null!;
}