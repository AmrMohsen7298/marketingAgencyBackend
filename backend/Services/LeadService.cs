using Microsoft.EntityFrameworkCore;
using MarketingApi.Models;

namespace MarketingApi.Services;

public interface ILeadService
{
    Task<IEnumerable<Lead>> GetAllAsync();
    Task<Lead?> GetByIdAsync(int id);
    Task<IEnumerable<Lead>> GetByCampaignIdAsync(int campaignId);
    Task<IEnumerable<Lead>> GetByStatusAsync(LeadStatus status);
    Task<Lead> CreateAsync(Lead lead);
    Task<Lead?> UpdateAsync(int id, Lead lead);
    Task<bool> DeleteAsync(int id);
}

public class LeadService : ILeadService
{
    private readonly Data.MarketingDbContext _context;
    
    public LeadService(Data.MarketingDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<Lead>> GetAllAsync()
    {
        return await Task.Run(() => _context.Leads.Include(l => l.Campaign).ToList());
    }
    
    public async Task<Lead?> GetByIdAsync(int id)
    {
        return await Task.Run(() => _context.Leads.Include(l => l.Campaign).FirstOrDefault(l => l.Id == id));
    }
    
    public async Task<IEnumerable<Lead>> GetByCampaignIdAsync(int campaignId)
    {
        return await Task.Run(() => _context.Leads.Where(l => l.CampaignId == campaignId).ToList());
    }
    
    public async Task<IEnumerable<Lead>> GetByStatusAsync(LeadStatus status)
    {
        return await Task.Run(() => _context.Leads.Where(l => l.Status == status).ToList());
    }
    
    public async Task<Lead> CreateAsync(Lead lead)
    {
        lead.CreatedAt = DateTime.UtcNow;
        lead.UpdatedAt = DateTime.UtcNow;
        _context.Leads.Add(lead);
        await Task.Run(() => _context.SaveChanges());
        return lead;
    }
    
    public async Task<Lead?> UpdateAsync(int id, Lead lead)
    {
        var existing = await Task.Run(() => _context.Leads.Find(id));
        if (existing == null) return null;
        
        existing.FirstName = lead.FirstName;
        existing.LastName = lead.LastName;
        existing.Email = lead.Email;
        existing.Phone = lead.Phone;
        existing.Company = lead.Company;
        existing.Status = lead.Status;
        existing.Source = lead.Source;
        existing.Notes = lead.Notes;
        existing.CampaignId = lead.CampaignId;
        existing.UpdatedAt = DateTime.UtcNow;
        
        await Task.Run(() => _context.SaveChanges());
        return existing;
    }
    
    public async Task<bool> DeleteAsync(int id)
    {
        var lead = await Task.Run(() => _context.Leads.Find(id));
        if (lead == null) return false;
        
        _context.Leads.Remove(lead);
        await Task.Run(() => _context.SaveChanges());
        return true;
    }
}
