# 🎬 Video Recording Guide

## 📖 Description

This guide explains how to use the video recording functionality in the testing framework. Videos are useful for:
- 🐛 Debugging failed tests
- 📊 Documenting test cases
- 🔍 Post-mortem analysis in CI/CD
- 👥 Sharing reproductions with the team

## 🚀 Basic Usage

### Option 1: NPM Command (Recommended)

```bash
npm run test:video
```

This command runs all tests with video recording enabled.

### Option 2: Environment Variable

```bash
RECORD_VIDEO=true npm test
```

### Option 3: With Specific Tags

```bash
RECORD_VIDEO=true npm run test:smoke
```

## 📋 Video Location

Videos are automatically saved in:

```
test-results/
└── videos/
    ├── Add_and_manage_complete_tasks_2026-02-15T16-44-10.webm
    ├── Add_multiple_tasks_2026-02-15T16-45-23.webm
    ├── Delete_specific_task_2026-02-15T16-46-15.webm
    └── ...
```

**Filename format:** `[Scenario_name]_[YYYY-MM-DDTHH-MM-SS].webm`

**Features:**
- ✅ Includes scenario name (without special characters)
- ✅ Includes execution date and time in ISO format
- ✅ WebM format (playable in any modern browser)
- ✅ Easy to identify and organize

## 🎬 Usage Examples

### Record All Tests

```bash
npm run test:video
```

### Record Only Smoke Tests

```bash
RECORD_VIDEO=true npm run test:smoke
```

### Record a Specific Feature

```bash
RECORD_VIDEO=true npx cucumber-js features/todomvc.feature
```

### Record a Specific Scenario

```bash
RECORD_VIDEO=true npx cucumber-js features/todomvc.feature:11
```

### Record in Headed Mode (View Browser)

```bash
RECORD_VIDEO=true npm run test:headed
```

## ⚙️ Configuration

### Current Configuration

The default configuration is in `src/support/world.ts`:

```typescript
recordVideo: process.env.RECORD_VIDEO === 'true' ? {
  dir: './test-results/videos',
  size: { width: 1280, height: 720 }
} : undefined,
```

### Change Resolution

You can modify video resolution by editing `world.ts`:

```typescript
// HD (1280x720) - Default
size: { width: 1280, height: 720 }

// Full HD (1920x1080)
size: { width: 1920, height: 1080 }

// 4K (3840x2160)
size: { width: 3840, height: 2160 }

// Mobile (375x812 - iPhone X)
size: { width: 375, height: 812 }
```

### Change Output Directory

```typescript
recordVideo: {
  dir: './custom-videos-folder',  // ← Change here
  size: { width: 1280, height: 720 }
}
```

## 🎯 Recording Strategies

### Strategy 1: Record Everything (Current)

**Pros:**
- ✅ You have complete record of all tests
- ✅ Useful for audit and documentation
- ✅ Easy to configure

**Cons:**
- ❌ Consumes a lot of disk space
- ❌ Slightly slows down execution

**Usage:** Local development and debugging

### Strategy 2: Record Only on Failures

**Pros:**
- ✅ Saves disk space
- ✅ Only save what's important
- ✅ Ideal for CI/CD

**Cons:**
- ❌ Requires additional configuration

**Implementation:**

In `src/support/hooks.ts`, modify the `After` hook:

```typescript
After(async function (this: CustomWorld, { pickle, result }) {
  // Screenshot on failures
  if (result?.status === Status.FAILED && this.page) {
    const timestamp = new Date().getTime();
    const screenshotPath = `./test-results/screenshots/failure-${timestamp}.png`;
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Screenshot saved: ${screenshotPath}`);
  }

  // Only save video if test failed
  if (result?.status === Status.PASSED && this.page) {
    const videoPath = await this.page.video()?.delete();
    console.log('✅ Test passed - Video deleted');
  } else if (result?.status === Status.FAILED && this.page) {
    const videoPath = await this.page.video()?.path();
    console.log(`🎥 Test failed - Video saved: ${videoPath}`);
  }

  await this.cleanup();
});
```

And in `src/support/world.ts`, always enable recording:

```typescript
recordVideo: {
  dir: './test-results/videos',
  size: { width: 1280, height: 720 }
}
```

### Strategy 3: Record Only with Flag

**Usage:** By default doesn't record, only when passing `RECORD_VIDEO=true`

This is the **current configuration** of the project.

## 📊 Video Sizes

Approximate sizes per minute of video:

| Resolution | Size/min | 100 tests |
|-----------|-----------|-----------|
| 1024x768  | ~2 MB     | ~200 MB   |
| 1280x720  | ~3 MB     | ~300 MB   |
| 1920x1080 | ~5 MB     | ~500 MB   |
| 3840x2160 | ~15 MB    | ~1.5 GB   |

**Recommendation:** Use 1280x720 for balance between quality and size.

## 🔍 View Videos

### macOS

```bash
# Open folder
open test-results/videos/

# View specific video
open test-results/videos/video-name.webm
```

### Linux

```bash
# List videos
ls -lh test-results/videos/

# View with VLC
vlc test-results/videos/video-name.webm
```

### Windows

```bash
# Open folder
explorer test-results\videos\

# View video
test-results\videos\video-name.webm
```

### Play in Browser

`.webm` files can be dragged directly to any modern browser (Chrome, Firefox, Edge, Safari).

## 🧹 Video Cleanup

### Clean All Results

```bash
npm run clean
```

This removes the entire `test-results/` folder including videos, screenshots and reports.

### Clean Only Videos

```bash
rm -rf test-results/videos/
```

### Clean Old Videos (7+ days)

```bash
find test-results/videos/ -name "*.webm" -mtime +7 -delete
```

## 🎓 Tips and Best Practices

### 1. Video Naming

Videos are automatically named with a custom format:

**Format:** `[Scenario_name]_[YYYY-MM-DDTHH-MM-SS].webm`

**Examples:**
```
Add_and_manage_complete_tasks_2026-02-15T16-44-10.webm
Filter_active_tasks_2026-02-15T16-45-23.webm
Delete_specific_task_2026-02-15T16-46-15.webm
```

**Benefits:**
- ✅ Easy to identify which test generated the video
- ✅ Automatic chronological sorting
- ✅ No name conflicts
- ✅ Ideal for CI/CD and reports

### 2. Share Videos

`.webm` videos are compatible with:
- ✅ All modern browsers
- ✅ VLC Media Player
- ✅ CI/CD platforms (GitHub Actions, GitLab CI)
- ✅ Reporting tools (Allure, TestRail)

### 3. CI/CD

In your CI/CD pipeline, always enable recording:

```yaml
# GitHub Actions
- name: Run Tests
  env:
    RECORD_VIDEO: true
  run: npm test

- name: Upload Videos
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: test-videos
    path: test-results/videos/
```

### 4. Performance Optimization

If tests run slow with video:

1. **Reduce resolution:**
   ```typescript
   size: { width: 1024, height: 768 }
   ```

2. **Record only in CI:**
   ```bash
   # Local: no video
   npm test
   
   # CI: with video
   RECORD_VIDEO=true npm test
   ```

3. **Use parallelization:**
   ```bash
   RECORD_VIDEO=true npm run test:parallel
   ```

## 🐛 Troubleshooting

### "Video file not found"

**Cause:** Video wasn't saved correctly

**Solution:**
1. Verify that `RECORD_VIDEO=true`
2. Ensure `test-results/videos/` folder exists
3. Check that context closes correctly in `cleanup()`

### "Video is corrupted"

**Cause:** Browser closed before finishing recording

**Solution:**
```typescript
// In hooks.ts, make sure to close correctly
await this.context?.close();  // ← This finalizes the video
await this.browser?.close();
```

### Very large videos

**Solution:**
- Reduce resolution
- Shorten tests
- Use selective recording (only failures)

### Can't play the video

**Solution:**
- Verify you have a compatible player (VLC, modern browser)
- `.webm` file may be corrupted if test was interrupted

## 📚 References

- [Playwright Video Recording](https://playwright.dev/docs/videos)
- [Cucumber Hooks](https://cucumber.io/docs/cucumber/api/#hooks)
- [WebM Format](https://www.webmproject.org/)

## ❓ FAQ

**Do videos slow down tests?**  
Yes, slightly (~5-10%). Use recording only when you need it.

**Can I change the video format?**  
No, Playwright only supports WebM, but it's compatible with everything.

**How much space do I need?**  
Depends on your suite. ~3MB per minute of test in 720p.

**Do videos include audio?**  
No, videos don't capture browser audio.

**Can I record only part of the test?**  
Not directly, but you can use `page.video()` for manual control.

## 🎬 Conclusion

Video recording is a powerful tool for:
- Effective debugging
- Visual documentation
- Failure analysis in CI/CD
- Continuous test improvement

**Recommendation:** Use `npm run test:video` during local development and enable automatic recording in CI/CD for failure analysis.
