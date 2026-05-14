using Microsoft.Playwright;
using System.Threading.Tasks;
using NUnit.Framework;

namespace PlaywrightTests.Fixtures
{
    public class TestFixtures
    {
        protected IPage Page { get; private set; }
        protected IBrowser Browser { get; private set; }
        protected IBrowserContext BrowserContext { get; private set; }

        [SetUp]
        public async Task Setup()
        {
            var playwright = await Playwright.CreateAsync();
            Browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions { Headless = true });
            BrowserContext = await Browser.NewContextAsync();
            Page = await BrowserContext.NewPageAsync();
        }

        [TearDown]
        public async Task TearDown()
        {
            await Page.CloseAsync();
            await BrowserContext.CloseAsync();
            await Browser.CloseAsync();
        }
    }
}
