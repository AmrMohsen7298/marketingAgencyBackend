using Microsoft.AspNetCore.Mvc;
using MarketingApi.Services;
using MarketingApi.Models;

namespace MarketingApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CampaignsController : ControllerBase
{
    private readonly ICampaignService _campaignService;
    
    public CampaignsController(ICampaignService campaignService)
    {
        _campaignService = campaignService;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Campaign>>> GetAll()
    {
        var campaigns = await _campaignService.GetAllAsync();
        return Ok(campaigns);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<Campaign>> GetById(int id)
    {
        var campaign = await _campaignService.GetByIdAsync(id);
        if (campaign == null)
            return NotFound(new { message = "Campaign not found" });
        return Ok(campaign);
    }
    
    [HttpGet("client/{clientId}")]
    public async Task<ActionResult<IEnumerable<Campaign>>> GetByClientId(int clientId)
    {
        var campaigns = await _campaignService.GetByClientIdAsync(clientId);
        return Ok(campaigns);
    }
    
    [HttpPost]
    public async Task<ActionResult<Campaign>> Create([FromBody] Campaign campaign)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
            
        var created = await _campaignService.CreateAsync(campaign);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<Campaign>> Update(int id, [FromBody] Campaign campaign)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
            
        var updated = await _campaignService.UpdateAsync(id, campaign);
        if (updated == null)
            return NotFound(new { message = "Campaign not found" });
        return Ok(updated);
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _campaignService.DeleteAsync(id);
        if (!result)
            return NotFound(new { message = "Campaign not found" });
        return NoContent();
    }
}
