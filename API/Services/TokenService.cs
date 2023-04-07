using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _cofig;
        public TokenService(UserManager<User> userManager, IConfiguration cofig)
        {
            _cofig = cofig;
            _userManager = userManager;

        }

        public async Task<String> GenerateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.UserName),
            };

            var roles = await _userManager.GetRolesAsync(user);

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var signature = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_cofig["JWTSettings:TokenKey"]));

            var creds = new SigningCredentials(signature, SecurityAlgorithms.HmacSha256);

            var options = new JwtSecurityToken(
                issuer: null,
                audience: null,
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds

            );

            return new JwtSecurityTokenHandler().WriteToken(options);
        }
    }
}