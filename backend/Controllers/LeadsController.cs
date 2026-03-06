using Microsoft.AspNetCore.Mvc;
using MarketingApi.Services;
using MarketingApi.Models;

namespace MarketingApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeadsController : ControllerBase
{
    private readonly ILeadService _leadService;
    
    public LeadsController(ILeadService leadService)
    {
        _leadService = leadService;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Lead>>> GetAll()
    {
        var leads = await _leadService.GetAllAsync();
        return Ok(leads);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<Lead>> GetById(int id)
    {
        var lead = await _leadService.GetByIdAsync(id);
        if (lead == null)
            return NotFound(new { message = "Lead not found" });
        return Ok(lead);
    }
    
    [HttpGet("campaign/{campaignId}")]
    public async Task<ActionResult<IEnumerable<Lead>>> GetByCampaignId(int campaignId)
    {
        var leads = await _leadService.GetByCampaignIdAsync(campaignId);
        return Ok(leads);
    }
    
    [HttpGet("status/{status}")]
    public async Task<ActionResult<IEnumerable<Lead>>> GetByStatus(LeadStatus status)
    {
        var leads = await _leadService.GetByStatusAsync(status);
        return Ok(leads);
    }
    
    [HttpPost]
    public async Task<ActionResult<Lead>> Create([FromBody] Lead lead)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
            
        var created = await _leadService.CreateAsync(lead);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<Lead>> Update(int id, [FromBody] Lead lead)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
            
        var updated = await _leadService.UpdateAsync(id, lead);
        if (updated == null)
            return NotFound(new { message = "Lead not found" });
        return Ok(updated);
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _leadService.DeleteAsync(id);
        if (!result)
            return NotFound(new { message = "Lead not found" });
        return NoContent();
    }
}
