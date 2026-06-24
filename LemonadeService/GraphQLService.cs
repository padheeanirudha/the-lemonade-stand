using HotChocolate;
using Microsoft.EntityFrameworkCore;
using LemonadeService.Data;
using LemonadeService.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LemonadeService.GraphQL
{
    // Inputs for submitting orders safely
    public record OrderItemInput(int VariantId, int Quantity);
    public record CreateOrderInput(string CustomerName, string CustomerContact, List<OrderItemInput> Items);
    
    // Server payload response structure
    public record OrderPayload(string OrderNumber, bool Success, string Message);

    public class Query
    {
        // Dynamically retrieves the full menu with its corresponding sizing options
        public async Task<List<Product>> GetProducts([Service] LemonadeDbContext context)
        {
            return await context.Products.Include(p => p.Variants).ToListAsync();
        }
    }

    public class Mutation
    {
        public async Task<OrderPayload> CreateOrder(CreateOrderInput input, [Service] LemonadeDbContext context)
        {
            if (input.Items == null || !input.Items.Any())
            {
                return new OrderPayload(string.Empty, false, "Your shopping cart is empty!");
            }

            try
            {
                decimal overallTotal = 0;
                var orderItemsToSave = new List<OrderItem>();

                // Process line-items securely using DB state prices to safeguard tampering
                foreach (var item in input.Items)
                {
                    var variant = await context.ProductVariants.FindAsync(item.VariantId);
                    if (variant == null)
                    {
                        return new OrderPayload(string.Empty, false, $"Item selection identity reference {item.VariantId} is missing.");
                    }

                    decimal itemTotal = variant.Price * item.Quantity;
                    overallTotal += itemTotal;

                    orderItemsToSave.Add(new OrderItem
                    {
                        VariantId = item.VariantId,
                        Quantity = item.Quantity,
                        Price = variant.Price
                    });
                }

                // Create unique confirmation tracker token
                string generatedOrderNum = $"ORD-2026-{Guid.NewGuid().ToString().Substring(0, 5).ToUpper()}";

                var newOrder = new Order
                {
                    OrderNumber = generatedOrderNum,
                    CustomerName = input.CustomerName,
                    CustomerContact = input.CustomerContact,
                    TotalAmount = overallTotal,
                    Items = orderItemsToSave
                };

                context.Orders.Add(newOrder);
                await context.SaveChangesAsync();

                return new OrderPayload(generatedOrderNum, true, "Order recorded successfully!");
            }
            catch (Exception ex)
            {
                return new OrderPayload(string.Empty, false, $"Internal checkout processing error: {ex.Message}");
            }
        }
    }
}