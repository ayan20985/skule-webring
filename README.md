# The Unnamed Webring

A webring for University of Toronto Engineering students and the broader UofT community. This webring connects personal websites, portfolios, and blogs of UofT students, faculty, and alumni.

## About

The Unnamed Webring is a community-driven project that connects websites of UofT community members through a retro-inspired webring. It's a way to discover interesting sites, share your work, and build connections within the UofT tech community.

The webring features a deliberately minimalist design, inspired by classic webrings like [XXIIVV](https://webring.xxiivv.com/) and [Fediring](https://fediring.net/), focusing on content and community rather than visual complexity.

## Joining the Webring

1. Add the webring widget to your website HTML (template below). Generally, you should add it to the footer.
2. Fork this repository and add your information to the BOTTOM of the `members` array in `js/webring-data.js` following this format:
   ```js
   {
     "name": "Your Name",
     "website": "https://your-website.com",
     "faculty": "Your Faculty (e.g., Engineering, Arts & Science, etc.)",
     "designation": "Your Role (e.g., Undergrad, Grad, Faculty, etc.)",
     "year": "1-25",  // Month and year added to the webring (e.g., 1-25 for January 2025)
     "grad": "2T5"    // Expected graduation year in UofT format (e.g., 2T5, 2T8)
   }
   ```
3. Submit a Pull Request! We'll try to review as fast as we can.

## Widget Templates

Since every website is unique, we suggest you add your own flair to the icon. Here are some examples to get you started:

### HTML:
```html
<div style="display: flex; align-items: center; gap: 15px; background-color: #f5f5f5; padding: 15px 25px; border-radius: 8px; border: 1px solid #ddd;">
    <a href="https://webring.ayanali.net/#your-site-here?nav=prev" style="color: #333; text-decoration: none; font-size: 1.5rem;">←</a>
    <a href="https://webring.ayanali.net/#your-site-here" target="_blank">
        <img src="https://webring.ayanali.net/img/icon.svg" alt="The Unnamed Webring" style="width: 32px; height: 32px;"/>
    </a>
    <a href="https://webring.ayanali.net/#your-site-here?nav=next" style="color: #333; text-decoration: none; font-size: 1.5rem;">→</a>
</div>
<!-- Replace 'your-site-here' with your actual site URL. Use icon-dark.svg for dark-themed sites -->
```

### JSX:
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
    <a href='https://webring.ayanali.net/#your-site-here?nav=prev' style={{ color: '#333', textDecoration: 'none', fontSize: '1.5rem' }}>←</a>
    <a href='https://webring.ayanali.net/#your-site-here' target='_blank'>
        <img src='https://webring.ayanali.net/img/icon.svg' alt='The Unnamed Webring' style={{ width: '32px', height: '32px' }}/>
    </a>
    <a href='https://webring.ayanali.net/#your-site-here?nav=next' style={{ color: '#333', textDecoration: 'none', fontSize: '1.5rem' }}>→</a>
</div>
// Replace 'your-site-here' with your actual site URL. Use icon-dark.svg for dark-themed sites
```

## Questions?

- **Who can join?** Any UofT student, alumni, faculty, or staff with a personal website.
- **My website isn't tech-related, can I still join?** Absolutely! The webring welcomes websites about any topic.
- **How do I report issues?** Please open an issue on this repository.

## Credits

Inspired by the [XXIIVV Webring](https://webring.xxiivv.com/), [Fediring](https://fediring.net/), and the early web's interconnected spirit.
