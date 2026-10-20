using Microsoft.EntityFrameworkCore;
using ReadingTracker.API.Models;

namespace ReadingTracker.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Book> Books { get; set; }
    public DbSet<ReadingLog> ReadingLogs { get; set; }
}