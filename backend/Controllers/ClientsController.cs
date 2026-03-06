using Microsoft.AspNetCore.Mvc;
using MarketingApi.Services;
using MarketingApi.Models;

namespace MarketingApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientsController : ControllerBase
{
    private readonly IClientService _clientService;
    
    public ClientsController(IClientService clientService)
    {
        _clientService = clientService;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Client>>> GetAll()
    {
        var clients = await _clientService.GetAllAsync();
        return Ok(clients);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<Client>> GetById(int id)
    {
        var client = await _clientService.GetByIdAsync(id);
        if (client == null)
            return NotFound(new { message = "Client not found" });
        return Ok(client);
    }
    
    [HttpPost]
    public async Task<ActionResult<Client>> Create([FromBody] Client client)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
            
        var created = await _clientService.CreateAsync(client);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<Client>> Update(int id, [FromBody] Client client)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
            
        var updated = await _clientService.UpdateAsync(id, client);
        if (updated == null)
            return NotFound(new { message = "Client not found" });
        return Ok(updated);
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _clientService.DeleteAsync(id);
        if (!result)
            return NotFound(new { message = "Client not found" });
        return NoContent();
    }
}
