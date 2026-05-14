using Microsoft.Playwright;
using NUnit.Framework;
using System.Threading.Tasks;
using System.Net.Http;
using System;
using System.Threading;

namespace PlaywrightTests.Tests
{
    [NUnit.Framework.NonParallelizable]
    public class LoginTests
    {
        private IPage _page;
        private IBrowser _browser;
        private IPlaywright _playwright;
        private IBrowserContext _context;
        private readonly string _devServerUrl = "http://localhost:5173";
        private static readonly HttpClient _httpClient = new HttpClient();

            [OneTimeSetUp]
            public async Task OneTimeSetup()
            {
                try
                {
                    using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(10));
                    var probe = await _httpClient.GetAsync(_devServerUrl + "/login", cts.Token);
                    if (probe.IsSuccessStatusCode)
                        TestContext.Out.WriteLine($"Confirmed app running at {_devServerUrl}/login");
                    else
                        TestContext.Out.WriteLine($"Warning: probe returned {(int)probe.StatusCode} — continuing.");
                }
                catch (Exception ex)
                {
                    TestContext.Out.WriteLine("Warning: failed to probe dev server: " + ex.Message + " — continuing.");
                }

                _playwright = await Playwright.CreateAsync();
                _browser = await _playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions { Headless = true });
                // In Playwright .NET 1.20.0, calling CloseAsync() on any browser resource (page or
                // context) between tests corrupts Connection internals and breaks subsequent API calls.
                // Work around this by creating all resources once here and reusing them for the life
                // of the fixture, clearing state via navigation + JS in SetUp instead of recreating.
                _context = await _browser.NewContextAsync();
                _page = await _context.NewPageAsync();
            }

            [SetUp]
            public async Task Setup()
            {
                await _context.ClearCookiesAsync();
                await _page.GotoAsync(_devServerUrl + "/login", new PageGotoOptions { WaitUntil = WaitUntilState.DOMContentLoaded, Timeout = 30000 });
                await _page.EvaluateAsync("() => localStorage.clear()");
            }

            [Test]
            public async Task Login_WithValidCredentials_ShouldSucceed()
            {
                await _page.GotoAsync(_devServerUrl + "/login", new PageGotoOptions { WaitUntil = WaitUntilState.NetworkIdle, Timeout = 60000 });
                // Wait for the username input to be available
                await _page.WaitForSelectorAsync("#username", new PageWaitForSelectorOptions { Timeout = 10000 });
                await _page.FillAsync("#username", "admin");
                await _page.FillAsync("#password", "admin");
                // Click the submit button (no id in the app) using type=submit
                await _page.ClickAsync("button[type=submit]");

                // Assert that the login was successful by checking navigation to root or localStorage flag
                // Wait for navigation to '/'
                await _page.WaitForURLAsync("**/", new PageWaitForURLOptions { Timeout = 5000 });
                var isAuth = await _page.EvaluateAsync<string>("() => localStorage.getItem('isAuthenticated')");
                Assert.AreEqual("true", isAuth);
            }

            [Test]
            public async Task Login_WithInvalidCredentials_ShouldFail()
            {
                await _page.GotoAsync(_devServerUrl + "/login", new PageGotoOptions { WaitUntil = WaitUntilState.NetworkIdle, Timeout = 60000 });
                await _page.WaitForSelectorAsync("#username", new PageWaitForSelectorOptions { Timeout = 10000 });
                await _page.FillAsync("#username", "invalidUser");
                await _page.FillAsync("#password", "invalidPassword");
                await _page.ClickAsync("button[type=submit]");

                // Assert that the login failed by checking presence of the inline error text
                var errorLocator = _page.Locator("text=Invalid username or password");
                await errorLocator.WaitForAsync(new LocatorWaitForOptions { Timeout = 5000 });
                var errorMessage = await errorLocator.InnerTextAsync();
                Assert.IsTrue(errorMessage.Contains("Invalid username or password"));
            }

            [TearDown]
            public async Task TearDown()
            {
                // Intentionally empty. Closing Playwright resources between tests in v1.20.0
                // corrupts the Connection object. State is reset in SetUp before each test instead.
            }

            [OneTimeTearDown]
            public async Task OneTimeTearDown()
            {
                if (_context != null) { await _context.CloseAsync(); _context = null; }
                if (_browser != null) { await _browser.CloseAsync(); _browser = null; }
                if (_playwright != null) { (_playwright as IDisposable)?.Dispose(); _playwright = null; }
            }
        }
    }
