# Custom Badge Guide for Examify

## 🎯 How to Add Custom PNG Badges

You can now add custom PNG badge images to your achievement system! Here's how:

### 📁 File Structure
```
public/
└── badges/
    ├── README.md
    ├── generate-badges.html
    ├── example-badge.svg
    ├── novice.png
    ├── enthusiast.png
    ├── master.png
    └── legend.png
```

### 🖼️ Adding Your Custom Badges

#### Method 1: Direct File Upload
1. **Prepare your PNG image**:
   - Size: 64x64 or 128x128 pixels (recommended)
   - Format: PNG with transparency
   - File size: Under 100KB
   - Background: Transparent preferred

2. **Name your file**:
   - Use lowercase letters and hyphens
   - Match the `imagePath` in the badge definition
   - Examples: `novice.png`, `high-scorer.png`, `streak-master.png`

3. **Place in directory**:
   - Save your PNG file in `public/badges/`
   - The path should match what's defined in `src/lib/achievementSystem.ts`

#### Method 2: Use the Badge Generator
1. Open `public/badges/generate-badges.html` in your browser
2. Click "Download" buttons to get sample badges
3. Save the PNG files to `public/badges/` with the correct names

#### Method 3: Use the BadgeUploader Component
The `BadgeUploader` component provides a user-friendly interface for uploading badges.

### 🔧 Current Badge Definitions

The system is configured for these badges:

| Badge ID | Name | Image Path | Icon Fallback |
|----------|------|------------|---------------|
| `novice` | Novice | `/badges/novice.png` | Target 🎯 |
| `enthusiast` | Enthusiast | `/badges/enthusiast.png` | BookOpen 📚 |
| `master` | Master | `/badges/master.png` | Trophy 🏆 |
| `legend` | Legend | `/badges/legend.png` | Crown 👑 |
| `high-scorer-badge` | High Scorer | `/badges/high-scorer.png` | Star ⭐ |
| `perfect-badge` | Perfect | `/badges/perfect.png` | Gem 💎 |
| `consistent-badge` | Consistent | `/badges/consistent.png` | TrendingUp 📈 |
| `accuracy-badge` | Accuracy Expert | `/badges/accuracy-expert.png` | Target 🎯 |
| `speed-badge` | Speed Demon | `/badges/speed-demon.png` | Zap ⚡ |
| `time-master-badge` | Time Master | `/badges/time-master.png` | Timer ⏱️ |
| `streak-badge` | Streak Master | `/badges/streak-master.png` | Flame 🔥 |
| `daily-learner-badge` | Daily Learner | `/badges/daily-learner.png` | Calendar 📅 |

### 🎨 Design Guidelines

#### Recommended Specifications:
- **Size**: 64x64 or 128x128 pixels
- **Format**: PNG with transparency
- **Color**: Bright, vibrant colors that stand out
- **Style**: Consistent with your app's design language
- **Background**: Transparent or solid color that matches the badge's theme

#### Design Tips:
- Use high contrast for visibility
- Keep details simple and recognizable at small sizes
- Consider the badge's rarity when choosing colors
- Test how the badge looks against different backgrounds

### 🔄 Fallback System

The system includes a robust fallback mechanism:
1. **Primary**: PNG image from `imagePath`
2. **Fallback**: Icon component if image fails to load
3. **Error handling**: Graceful degradation with user feedback

### 🚀 Adding New Badge Types

To add completely new badge types:

1. **Update the Badge interface** (if needed):
   ```typescript
   export interface Badge {
     id: string;
     name: string;
     description: string;
     icon?: any;
     imagePath?: string;
     color: string;
     rarity: 'common' | 'rare' | 'epic' | 'legendary';
     unlocked: boolean;
     unlockedAt?: Date;
     category: string;
   }
   ```

2. **Add to BADGE_DEFINITIONS**:
   ```typescript
   {
     id: 'your-new-badge',
     name: 'Your New Badge',
     description: 'Description of your badge',
     icon: YourIconComponent,
     imagePath: '/badges/your-new-badge.png',
     color: 'bg-your-color-500',
     rarity: 'rare',
     unlocked: false,
     category: 'your-category'
   }
   ```

3. **Add your PNG image** to `public/badges/`

### 🎯 Testing Your Badges

1. **Start the development server**: `npm run dev`
2. **Navigate to Achievements page**
3. **Check the Badges tab**
4. **Verify images load correctly**
5. **Test fallback behavior** by temporarily removing an image file

### 🛠️ Troubleshooting

#### Image Not Loading?
- Check file path matches `imagePath` in badge definition
- Verify file is in `public/badges/` directory
- Ensure file name uses lowercase and hyphens
- Check browser console for 404 errors

#### Fallback Not Working?
- Verify icon component is imported
- Check that `icon` property is set in badge definition
- Ensure icon component is a valid React component

#### Performance Issues?
- Optimize image file size (under 100KB)
- Use appropriate image dimensions
- Consider using WebP format for better compression

### 📝 Example Implementation

Here's a complete example of adding a custom badge:

1. **Create your PNG image**: `public/badges/custom-badge.png`

2. **Add to badge definitions**:
   ```typescript
   {
     id: 'custom-badge',
     name: 'Custom Badge',
     description: 'Your custom achievement',
     icon: Star, // Fallback icon
     imagePath: '/badges/custom-badge.png',
     color: 'bg-purple-500',
     rarity: 'epic',
     unlocked: false,
     category: 'special'
   }
   ```

3. **Test in the app** - your badge should now appear with your custom image!

### 🎉 That's It!

Your custom PNG badges are now fully integrated into the achievement system. The system will automatically use your images when available and fall back to icons when needed.

Happy badge designing! 🏆 