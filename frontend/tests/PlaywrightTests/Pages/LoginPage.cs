using Microsoft.Playwright;
using System.Threading.Tasks;

namespace PlaywrightTests.Pages
{
    public class LoginPage
    {
        private readonly IPage _page;

        public LoginPage(IPage page)
        {
            _page = page;
        }

        private ILocator UsernameField => _page.Locator("input[name='username']");
        private ILocator PasswordField => _page.Locator("input[name='password']");
        private ILocator LoginButton => _page.Locator("button[type='submit']");

        public async Task EnterUsername(string username)
        {
            await UsernameField.FillAsync(username);
        }

        public async Task EnterPassword(string password)
        {
            await PasswordField.FillAsync(password);
        }

        public async Task ClickLoginButton()
        {
            await LoginButton.ClickAsync();
        }

        public async Task<bool> IsLoginButtonVisible()
        {
            return await LoginButton.IsVisibleAsync();
        }
    }
}
