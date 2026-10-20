using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReadingTracker.API.Data;
using ReadingTracker.API.DTOs;
using ReadingTracker.API.Models;

namespace ReadingTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Requires a valid JWT bearer token for protected endpoints
public class BooksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BooksController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Books
    [HttpGet]
    [AllowAnonymous] // Anyone can browse the catalog
    public async Task<ActionResult<IEnumerable<BookResponseDto>>> GetBooks([FromQuery] string? search)
    {
        var query = _context.Books.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(b => b.Title.ToLower().Contains(term) || b.Author.ToLower().Contains(term));
        }

        var books = await query
            .OrderBy(b => b.Title)
            .Select(b => new BookResponseDto
            {
                Id = b.Id,
                Title = b.Title,
                Author = b.Author,
                TotalPages = b.TotalPages,
                CoverImageUrl = b.CoverImageUrl,
                CreatedAt = b.CreatedAt
            })
            .ToListAsync();

        return Ok(books);
    }

    // GET: api/Books/{id}
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<BookResponseDto>> GetBook(int id)
    {
        var book = await _context.Books.AsNoTracking().FirstOrDefaultAsync(b => b.Id == id);

        if (book == null)
            return NotFound($"Book with ID '{id}' was not found.");

        return Ok(new BookResponseDto
        {
            Id = book.Id,
            Title = book.Title,
            Author = book.Author,
            TotalPages = book.TotalPages,
            CoverImageUrl = book.CoverImageUrl,
            CreatedAt = book.CreatedAt
        });
    }

    // POST: api/Books
    [HttpPost]
    public async Task<ActionResult<BookResponseDto>> CreateBook(CreateBookDto request)
    {
        if (request.TotalPages <= 0)
            return BadRequest("Total pages must be greater than zero.");

        var book = new Book
        {
            Title = request.Title.Trim(),
            Author = request.Author.Trim(),
            TotalPages = request.TotalPages,
            CoverImageUrl = request.CoverImageUrl?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.Books.Add(book);
        await _context.SaveChangesAsync();

        var response = new BookResponseDto
        {
            Id = book.Id,
            Title = book.Title,
            Author = book.Author,
            TotalPages = book.TotalPages,
            CoverImageUrl = book.CoverImageUrl,
            CreatedAt = book.CreatedAt
        };

        return CreatedAtAction(nameof(GetBook), new { id = book.Id }, response);
    }
}