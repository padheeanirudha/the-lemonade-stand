using Microsoft.EntityFrameworkCore;
using LemonadeService.GraphQL;
using LemonadeService.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();

// // 1. Register the database context and explicitly bind it to a SQLite file
builder.Services.AddDbContext<LemonadeDbContext>(options =>
    options.UseSqlite("Data Source=lemonade.db"));

// 2. Register the permissive CORS policy framework for cloud spaces routing
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 3. Register the HotChocolate GraphQL server engine with detailed errors enabled
builder.Services.AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .ModifyRequestOptions(opt => opt.IncludeExceptionDetails = true); // 👈 Add this line

// 3. Register the HotChocolate GraphQL server engine
// builder.Services.AddGraphQLServer()
//     .AddQueryType<Query>()
//     .AddMutationType<Mutation>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Only redirect to HTTPS if we are not running inside a local development environment
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// 4. Activate the CORS layer BEFORE endpoint mapping rules execute
app.UseCors();

app.UseRouting();

// 5. Map the GraphQL endpoint (/graphql) back to the server pipeline
app.MapGraphQL();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

// 6. Asynchronously handle SQLite initialization safely to avoid hanging the main thread
_ = Task.Run(async () =>
{
    // Wait brief moment for Kestrel to bind to its listening ports first
    await Task.Delay(1500); 
    
    using var scope = app.Services.CreateScope();
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<LemonadeDbContext>();
        
        // Build schema file cleanly if it does not exist
        if (await context.Database.EnsureCreatedAsync())
        {
            Console.WriteLine("--> SQLite Database file and schema generated successfully!");
        }

        // Programmatic baseline seeding fallback
        if (!await context.Products.AnyAsync())
        {
            var classic = new LemonadeService.Models.Product 
            { 
                Name = "Classic Lemonade", 
                Description = "Freshly squeezed lemons with sugar syrup.",
                Variants = new List<LemonadeService.Models.ProductVariant>
                {
                    new() { SizeName = "Small", Price = 2.50m },
                    new() { SizeName = "Regular", Price = 3.50m },
                    new() { SizeName = "Large", Price = 4.49m }
                }
            };
            
            await context.Products.AddAsync(classic);
            await context.SaveChangesAsync();
            Console.WriteLine("--> Database seed elements successfully injected.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"--> DB Init Warning: {ex.Message}");
    }
});

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}