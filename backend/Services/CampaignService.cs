using Microsoft.EntityFrameworkCore;
using MarketingApi.Models;

namespace MarketingApi.Services;

public interface ICampaignService
{
    Task<IEnumerable<Campaign>> GetAllAsync();
    Task<Campaign?> GetByIdAsync(int id);
    Task<IEnumerable<Campaign>> GetByClientIdAsync(int clientId);
    Task<Campaign> CreateAsync(Campaign campaign);
    Task<Campaign?> UpdateAsync(int id, Campaign campaign);
    Task<bool> DeleteAsync(int id);
}

public class CampaignService : ICampaignService
{
    private readonly Data.MarketingDbContext _context;
    
    public CampaignService(Data.MarketingDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<Campaign>> GetAllAsync()
    {
        return await Task.Run(() => _context.Campaigns.Include(c => c.Client).ToList());
    }
    
    public async Task<Campaign?> GetByIdAsync(int id)
    {
        return await Task.Run(() => _context.Campaigns.Include(c => c.Client).FirstOrDefault(c => c.Id == id));
    }
    
    public async Task<IEnumerable<Campaign>> GetByClientIdAsync(int clientId)
    {
        return await Task.Run(() => _context.Campaigns.Where(c => c.ClientId == clientId).ToList());
    }
    
    public async Task<Campaign> CreateAsync(Campaign campaign)
    {
        campaign.CreatedAt = DateTime.UtcNow;
        campaign.UpdatedAt = DateTime.UtcNow;
        _context.Campaigns.Add(campaign);
        await Task.Run(() => _context.SaveChanges());
        return campaign;
    }
    
    public async Task<Campaign?> UpdateAsync(int id, Campaign campaign)
    {
        var existing = await Task.Run(() => _context.Campaigns.Find(id));
        if (existing == null) return null;
        
        existing.Name = campaign.Name;
        existing.Description = campaign.Description;
        existing.Type = campaign.Type;
        existing.Status = campaign.Status;
        existing.Budget = campaign.Budget;
        existing.StartDate = campaign.StartDate;
        existing.EndDate = campaign.EndDate;
        existing.UpdatedAt = DateTime.UtcNow;
        
        await Task.Run(() => _context.SaveChanges());
        return existing;
    }
    
    public async Task<bool> DeleteAsync(int id)
    {
        var campaign = await Task.Run(() => _context.Campaigns.Find(id));
        if (campaign == null) return false;
        
        _context.Campaigns.Remove(campaign);
        await Task.Run(() => _context.SaveChanges());
        return true;
    }
}
