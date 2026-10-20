namespace ReadingTracker.API.DTOs;
using ReadingTracker.API.Models;
using System;

public class CreateReadingLogDto
{
public int BookId { get; set; }
public ReadingStatus Status { get; set; }
public int CurrentPage { get; set; }
public int? Rating { get; set; }
public string? KeyTakeaways { get; set; }
public string? PersonalNotes { get; set; }
public DateTime? StartDate { get; set; }
public DateTime? FinishDate { get; set; }
}

public class UpdateReadingLogDto
{
public ReadingStatus Status { get; set; }
public int CurrentPage { get; set; }
public int? Rating { get; set; }
public string? KeyTakeaways { get; set; }
public string? PersonalNotes { get; set; }
public DateTime? StartDate { get; set; }
public DateTime? FinishDate { get; set; }
}

public class ReadingLogResponseDto
{
public int Id { get; set; }
public int BookId { get; set; }
public string BookTitle { get; set; } = string.Empty;
public ReadingStatus Status { get; set; }
public int CurrentPage { get; set; }
public int? Rating { get; set; }
public string? KeyTakeaways { get; set; }
public string? PersonalNotes { get; set; }
public DateTime? StartDate { get; set; }
public DateTime? FinishDate { get; set; }
public DateTime LastUpdated { get; set; }
}