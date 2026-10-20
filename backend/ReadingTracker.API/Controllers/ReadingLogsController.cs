using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ReadingTracker.API.Data;
using ReadingTracker.API.DTOs;
using ReadingTracker.API.Models;

namespace ReadingTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReadingLogsController : ControllerBase
{
private readonly ApplicationDbContext _context;

public ReadingLogsController(ApplicationDbContext context)
{
    _context = context;
}

// Helper method to get the user ID securely from the JWT token
private int GetUserId()
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("id");
    return int.Parse(userIdClaim!.Value);
}

[HttpGet]
public async Task<ActionResult<IEnumerable<ReadingLogResponseDto>>> GetMyReadingLogs()
{
    var userId = GetUserId();

    var logs = await _context.ReadingLogs
        .Include(r => r.Book)
        .Where(r => r.UserId == userId)
        .OrderByDescending(r => r.LastUpdated)
        .Select(r => new ReadingLogResponseDto
        {
            Id = r.Id,
            BookId = r.BookId,
            BookTitle = r.Book.Title,
            Status = r.Status,
            CurrentPage = r.CurrentPage,
            Rating = r.Rating,
            KeyTakeaways = r.KeyTakeaways,
            PersonalNotes = r.PersonalNotes,
            StartDate = r.StartDate,
            FinishDate = r.FinishDate,
            LastUpdated = r.LastUpdated
        })
        .ToListAsync();

    return Ok(logs);
}

[HttpPost]
public async Task<ActionResult<ReadingLogResponseDto>> CreateLog(CreateReadingLogDto request)
{
    var userId = GetUserId();

    var book = await _context.Books.FindAsync(request.BookId);
    if (book == null) return NotFound("Book not found.");

    var existingLog = await _context.ReadingLogs
        .FirstOrDefaultAsync(r => r.UserId == userId && r.BookId == request.BookId);
    if (existingLog != null) return BadRequest("You already have a reading log for this book.");

    var log = new ReadingLog
    {
        UserId = userId,
        BookId = request.BookId,
        Status = request.Status,
        CurrentPage = request.CurrentPage,
        Rating = request.Rating,
        KeyTakeaways = request.KeyTakeaways,
        PersonalNotes = request.PersonalNotes,
        StartDate = request.StartDate,
        FinishDate = request.FinishDate,
        LastUpdated = DateTime.UtcNow
    };

    _context.ReadingLogs.Add(log);
    await _context.SaveChangesAsync();

    return Ok("Reading log created successfully.");
}

[HttpPut("{id}")]
public async Task<ActionResult> UpdateLog(int id, UpdateReadingLogDto request)
{
    var userId = GetUserId();

    var log = await _context.ReadingLogs
        .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

    if (log == null) return NotFound("Reading log not found.");

    log.Status = request.Status;
    log.CurrentPage = request.CurrentPage;
    log.Rating = request.Rating;
    log.KeyTakeaways = request.KeyTakeaways;
    log.PersonalNotes = request.PersonalNotes;
    log.StartDate = request.StartDate;
    log.FinishDate = request.FinishDate;
    log.LastUpdated = DateTime.UtcNow;

    await _context.SaveChangesAsync();

    return Ok("Reading log updated successfully.");
}
}