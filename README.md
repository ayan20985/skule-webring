# Use the [Webring Tool](https://webring.ayanali.net/webring-tool/) for Quick-Join

# SKULE Test Website Phone Book

A webring for University of Toronto Engineering students and the broader UofT community. This webring connects personal websites, portfolios, and blogs of UofT students, faculty, and alumni.

## About

The Unnamed Webring is a community-driven project that connects websites of UofT community members through a retro-inspired webring. It's a way to discover interesting sites, share your work, and build connections within the UofT tech community.

The webring features a deliberately minimalist design, inspired by classic webrings like [XXIIVV](https://webring.xxiivv.com/), focusing on content and community rather than visual complexity.

## Joining the Webring

### Requirements

1. **Genuine Content** - Your website should be "made with hands," meaning it contains genuine and useful content. Auto-generated sites or pages with minimal effort are not eligible.

2. **Website Badge** - You must provide a badge icon in .PNG or .GIF format that will be displayed in the members list. See the [Website Badges](#website-badges) section below for details.

3. **Widget Integration** - The webring widget must be included on your website in an accessible location (preferably in the footer or sidebar).

4. **UofT Affiliation** - You must be a UofT student, alumni, faculty, or staff member.

### Join Process

1. Add the webring widget to your website HTML (template below). 

2. Fork this repository and add your information to the BOTTOM of the `members` array in `js/webring-data.js` following this format:
   ```js
   {
     "name": "Your Name",
     "website": "https://your-website.com",
     "program": "Your Program (e.g., Engineering, Arts & Science, etc.)",
     "designation": "Your Role (e.g., Undergrad, Grad, Faculty, etc.)",
     "year": "1-25",  // Month and year added to the webring (e.g., 1-25 for January 2025)
     "grad": "2T5",   // Expected graduation year in UofT format (e.g., 2T5, 2T8) or standard year (2025)
     "badge": "https://your-website.com/badge.png"  // URL to your custom website badge (required)
   }
   ```

3. Submit a Pull Request! We'll try to review as fast as we can.

### Maintenance

Websites may be removed from the webring if they become defunct (e.g., domain expires, site becomes inaccessible, or content is removed). We'll make reasonable attempts to contact site owners before removal.

## Widget Templates

Since every website is unique, we suggest you add your own flair to the icon. Here are some examples to get you started:

**Use the tool: [https://webring.ayanali.net/webring-tool/](https://webring.ayanali.net/webring-tool/) to generate a custom widget for your website. Or, you can use the following templates to create your own widget:**
### Light Mode Widget:
```html
<div style="display: flex; align-items: center; gap: 15px; background-color: #f5f5f5; padding: 15px 25px; border-radius: 8px; border: 1px solid #ddd;">
    <a href="https://webring.ayanali.net/#https://your-website.com?nav=prev" style="color: #333; text-decoration: none; font-size: 1.5rem;">←</a>
    <a href="https://webring.ayanali.net/#https://your-website.com" target="_blank">
        <img src="https://webring.ayanali.net/img/icon.svg" alt="The Unnamed Webring" style="width: 32px; height: 32px;"/>
    </a>
    <a href="https://webring.ayanali.net/#https://your-website.com?nav=next" style="color: #333; text-decoration: none; font-size: 1.5rem;">→</a>
</div>
<!-- Replace 'your-website.com' with your actual website URL -->
```

### Dark Mode Widget:
```html
<div style="display: flex; align-items: center; gap: 15px; background-color: #2a2a2a; padding: 15px 25px; border-radius: 8px; border: 1px solid #444;">
    <a href="https://webring.ayanali.net/#https://your-website.com?nav=prev" style="color: #e0e0e0; text-decoration: none; font-size: 1.5rem;">←</a>
    <a href="https://webring.ayanali.net/#https://your-website.com" target="_blank">
        <img src="https://webring.ayanali.net/img/icon-dark.svg" alt="The Unnamed Webring" style="width: 32px; height: 32px;"/>
    </a>
    <a href="https://webring.ayanali.net/#https://your-website.com?nav=next" style="color: #e0e0e0; text-decoration: none; font-size: 1.5rem;">→</a>
</div>
<!-- Replace 'your-website.com' with your actual website URL -->
```

### JSX (Light Mode):
```jsx
<div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  gap: '15px',
  backgroundColor: '#f5f5f5',
  padding: '15px 25px',
  borderRadius: '8px',
  border: '1px solid #ddd'
}}>
    <a href='https://webring.ayanali.net/#https://your-website.com?nav=prev' style={{ color: '#333', textDecoration: 'none', fontSize: '1.5rem' }}>←</a>
    <a href='https://webring.ayanali.net/#https://your-website.com' target='_blank'>
        <img src='https://webring.ayanali.net/img/icon.svg' alt='The Unnamed Webring' style={{ width: '32px', height: '32px' }}/>
    </a>
    <a href='https://webring.ayanali.net/#https://your-website.com?nav=next' style={{ color: '#333', textDecoration: 'none', fontSize: '1.5rem' }}>→</a>
</div>
// Replace 'your-website.com' with your actual website URL
```

### JSX (Dark Mode):
```jsx
<div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  gap: '15px',
  backgroundColor: '#2a2a2a',
  padding: '15px 25px',
  borderRadius: '8px',
  border: '1px solid #444'
}}>
    <a href='https://webring.ayanali.net/#https://your-website.com?nav=prev' style={{ color: '#e0e0e0', textDecoration: 'none', fontSize: '1.5rem' }}>←</a>
    <a href='https://webring.ayanali.net/#https://your-website.com' target='_blank'>
        <img src='https://webring.ayanali.net/img/icon-dark.svg' alt='The Unnamed Webring' style={{ width: '32px', height: '32px' }}/>
    </a>
    <a href='https://webring.ayanali.net/#https://your-website.com?nav=next' style={{ color: '#e0e0e0', textDecoration: 'none', fontSize: '1.5rem' }}>→</a>
</div>
// Replace 'your-website.com' with your actual website URL
```

You can also add automatic theme switching based on the user's system preference. Check the GitHub repository for more advanced implementation examples.

## Website Badges

You can create a custom badge for your website to display in the members table. This is a great way to showcase your personal brand or website design.

### Creating Your Badge

1. Create a PNG, GIF, or SVG image for your website badge
2. Recommended dimensions: 88px × 31px (standard badge size)
3. Upload the badge to your website or include it in a PR
4. Include the path to your badge in your member entry in the `badge` field
   - For badges hosted on your website: use the full URL (e.g., `https://your-website.com/badge.png`)
   - For badges included in a PR: use a relative path (e.g., `badges/your-custom-badge.svg`)

### Badge Examples and Formatting
Badges must be 88x31 pixels or some multiple of this, they can png, .gif, or .svg file types.
[Here](https://cyber.dabamos.de/88x31/index2.html) are some example badge styles you might consider.

### HTML for Linking Your Badge

If you want to link your badge on your own site:

```html
<a href="https://webring.ayanali.net/#https://your-website.com">
  <img src="path/to/your/badge.png" alt="Member of The Unnamed Webring" width="88" height="31" />
</a>
```

## Questions?

- **Who can join?** Any UofT student, alumni, faculty, or staff with a personal website.
- **My website isn't tech-related, can I still join?** Absolutely! The webring welcomes websites about any topic.
- **How do I report issues?** Please open an issue on this repository.

## Credits

Inspired by the [XXIIVV Webring](https://webring.xxiivv.com/) and the early web's interconnected spirit.
