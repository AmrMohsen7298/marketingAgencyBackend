namespace MarketingApi.Models;

public class Campaign
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // Email, Social, PPC, Content
    public CampaignStatus Status { get; set; } = CampaignStatus.Draft;
    public decimal Budget { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public int ClientId { get; set; }
    public Client Client { get; set; } = null!;
    
    public ICollection<Lead> Leads { get; set; } = new List<Lead>();
}

public enum CampaignStatus
{
    Draft,
    Active,
    Paused,
    Completed,
    Cancelled
}
