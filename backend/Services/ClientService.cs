using MarketingApi.Models;

namespace MarketingApi.Services;

public interface IClientService
{
    Task<IEnumerable<Client>> GetAllAsync();
    Task<Client?> GetByIdAsync(int id);
    Task<Client> CreateAsync(Client client);
    Task<Client?> UpdateAsync(int id, Client client);
    Task<bool> DeleteAsync(int id);
}

public class ClientService : IClientService
{
    private readonly Data.MarketingDbContext _context;
    
    public ClientService(Data.MarketingDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<Client>> GetAllAsync()
    {
        return await Task.Run(() => _context.Clients.ToList());
    }
    
    public async Task<Client?> GetByIdAsync(int id)
    {
        return await Task.Run(() => _context.Clients.Find(id));
    }
    
    public async Task<Client> CreateAsync(Client client)
    {
        client.CreatedAt = DateTime.UtcNow;
        client.UpdatedAt = DateTime.UtcNow;
        _context.Clients.Add(client);
        await Task.Run(() => _context.SaveChanges());
        return client;
    }
    
    public async Task<Client?> UpdateAsync(int id, Client client)
    {
        var existing = await Task.Run(() => _context.Clients.Find(id));
        if (existing == null) return null;
        
        existing.Name = client.Name;
        existing.Email = client.Email;
        existing.Phone = client.Phone;
        existing.Company = client.Company;
        existing.Industry = client.Industry;
        existing.UpdatedAt = DateTime.UtcNow;
        
        await Task.Run(() => _context.SaveChanges());
        return existing;
    }
    
    public async Task<bool> DeleteAsync(int id)
    {
        var client = await Task.Run(() => _context.Clients.Find(id));
        if (client == null) return false;
        
        _context.Clients.Remove(client);
        await Task.Run(() => _context.SaveChanges());
        return true;
    }
}
