# Badge Images

This directory contains PNG badge images for the achievement system.

## How to Add Custom Badges

1. **Prepare your PNG image**: 
   - Recommended size: 64x64 pixels or 128x128 pixels
   - Format: PNG with transparency
   - Keep file size under 100KB for optimal performance

2. **Naming convention**:
   - Use lowercase letters and hyphens
   - Match the `imagePath` in the badge definition
   - Example: `novice.png`, `high-scorer.png`, `streak-master.png`

3. **Place your image**:
   - Save your PNG file in this directory
   - The path should match what's defined in `src/lib/achievementSystem.ts`

## Current Badge Images Needed

- `novice.png` - First quiz completion
- `enthusiast.png` - 5 quizzes completed
- `master.png` - 25 quizzes completed
- `legend.png` - 100 quizzes completed
- `high-scorer.png` - 90%+ score achievement
- `perfect.png` - 100% score achievement
- `consistent.png` - 80%+ average score
- `accuracy-expert.png` - 95%+ accuracy
- `speed-demon.png` - Fast quiz completion
- `time-master.png` - Excellent time management
- `streak-master.png` - 7-day quiz streak
- `daily-learner.png` - 30-day quiz streak

## Fallback System

If a PNG image fails to load, the system will automatically fall back to the icon component defined in the badge configuration. 