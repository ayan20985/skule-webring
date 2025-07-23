<div align="center">
  <img src="https://github.com/user-attachments/assets/842176af-1964-47de-9dde-9e747044502a" alt="icon-dark" width="257.5"/>
  <img src="https://github.com/user-attachments/assets/6f41a501-1088-4487-8fbb-81373a58dfe6" alt="icon-light" width="257.5"/>
   <br>
  <img width="88" height="31" alt="webring-member" src="https://github.com/user-attachments/assets/bcd44bc1-dd47-4c12-852b-aac3fcf3106d" />
  <img width="251" height="31" alt="join-the-webring" src="https://github.com/user-attachments/assets/8aec4e4f-1777-4058-a700-4a091a10c585" />
  <img width="88" height="31" alt="webring-hardhat" src="https://github.com/user-attachments/assets/8327440c-d5dc-4dde-bebf-1a7b4022a573" />
  <img width="88" height="31" alt="ring" src="https://github.com/user-attachments/assets/d964ad9a-d6a4-4fde-a598-b83d75678252" />

</div>

# SKULE WebRing

A WebRing for University of Toronto Engineering students and the broader UofT community. This WebRing connects personal websites, portfolios, and blogs of UofT students, faculty, and alumni.

## About

The SKULE WebRing is a community-driven project that connects websites of UofT community members through a retro-inspired WebRing. It's a way to discover interesting sites, share your work, and build connections within the UofT tech community.

## Joining the WebRing

### Requirements

1. **Genuine Content** - Your website should be "made with hands," meaning it contains genuine and useful content. Auto-generated sites or pages with minimal effort are not eligible.

2. **Appropriateness** - Content must be appropriate, websites should not host illegal information nor aid in the dissemination of such information.

2. **Website Badge** - You must provide a badge icon in .PNG or .GIF format that will be displayed in the members list. See the [Website Badges](#website-badges) section below for details.

3. **Widget Integration** - The WebRing widget must be included on your website in an accessible location (preferably in the footer or sidebar).

4. **UofT Affiliation** - You must be a UofT student, alumni, faculty, or staff member.

### Join Process

1. Fill in the student information form in [here](https://docs.google.com/forms/d/e/1FAIpQLSdL70J2n1XTJ9DRo2T2uL_Nzn7Jpl_HiuDwihizBAFw6JufzQ/viewform?usp=sharing&ouid=108594782023550487497).

2. Add the WebRing widget to your website HTML (template below). 

3. Fork this repository and add your information to the BOTTOM of the `members` array in `js/WebRing-data.js` following this format:
   ```js
   {
     "name": "Your Name",
     "website": "https://your-website.com",
     "program": "Your Program (e.g., Engineering, Arts & Science, etc.)",
     "designation": "Your Role (e.g., Undergrad, Grad, Faculty, etc.)",
     "year": "1-25",  // Month and year added to the WebRing (e.g., 1-25 for January 2025)
     "grad": "2T5",   // Expected graduation year in UofT format (e.g., 2T5, 2T8) or standard year (2025)
     "badge": "https://your-website.com/badge.png"  // URL to your custom website badge (required)
   }
   ```

3. Submit a Pull Request.

### Maintenance

Websites may be removed from the WebRing if they become defunct (e.g., domain expires, site becomes inaccessible, or content is removed). Websites will be removed if content on websites becomes inappropriate for the ring. We'll make reasonable attempts to contact site owners before removal.

## Widget Templates

Since every website is unique, we suggest you add your own flair to the icon. Here are some examples to get you started:

### Light Mode Widget:
```html
<div style="display: flex; align-items: center; gap: 15px; background-color: #f5f5f5; padding: 15px 25px; border-radius: 8px; border: 1px solid #ddd;">
    <a href="https://WebRing.skule.ca/#https://your-website.com?nav=prev" style="color: #333; text-decoration: none; font-size: 1.5rem;">←</a>
<a href="https://WebRing.skule.ca/#https://your-website.com" target="_blank">
<img src="https://WebRing.skule.ca/img/icon.svg" alt="SKULE WebRing" style="width: 32px; height: 32px;"/>
</a>
<a href="https://WebRing.skule.ca/#https://your-website.com?nav=next" style="color: #333; text-decoration: none; font-size: 1.5rem;">→</a>
</div>
<!-- Replace 'your-website.com' with your actual website URL -->
```

### Dark Mode Widget:
```html
<div style="display: flex; align-items: center; gap: 15px; background-color: #2a2a2a; padding: 15px 25px; border-radius: 8px; border: 1px solid #444;">
    <a href="https://WebRing.skule.ca/#https://your-website.com?nav=prev" style="color: #e0e0e0; text-decoration: none; font-size: 1.5rem;">←</a>
<a href="https://WebRing.skule.ca/#https://your-website.com" target="_blank">
<img src="https://WebRing.skule.ca/img/icon-dark.svg" alt="SKULE WebRing" style="width: 32px; height: 32px;"/>
</a>
<a href="https://WebRing.skule.ca/#https://your-website.com?nav=next" style="color: #e0e0e0; text-decoration: none; font-size: 1.5rem;">→</a>
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
    <a href='https://WebRing.skule.ca/#https://your-website.com?nav=prev' style={{ color: '#333', textDecoration: 'none', fontSize: '1.5rem' }}>←</a>
<a href='https://WebRing.skule.ca/#https://your-website.com' target='_blank'>
<img src='https://WebRing.skule.ca/img/icon.svg' alt='SKULE WebRing' style={{ width: '32px', height: '32px' }}/>
</a>
<a href='https://WebRing.skule.ca/#https://your-website.com?nav=next' style={{ color: '#333', textDecoration: 'none', fontSize: '1.5rem' }}>→</a>
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
    <a href='https://WebRing.skule.ca/#https://your-website.com?nav=prev' style={{ color: '#e0e0e0', textDecoration: 'none', fontSize: '1.5rem' }}>←</a>
<a href='https://WebRing.skule.ca/#https://your-website.com' target='_blank'>
<img src='https://WebRing.skule.ca/img/icon-dark.svg' alt='SKULE WebRing' style={{ width: '32px', height: '32px' }}/>
</a>
<a href='https://WebRing.skule.ca/#https://your-website.com?nav=next' style={{ color: '#e0e0e0', textDecoration: 'none', fontSize: '1.5rem' }}>→</a>
</div>
// Replace 'your-website.com' with your actual website URL
```

You can also add automatic theme switching based on the user's system preference. Check the GitHub repository for more advanced implementation examples.

## Website Badges

You can create a custom badge for your website to display in the members table. This is a great way to showcase your personal brand or website design.

### Creating Your Badge

1. Create a PNG, GIF, or SVG image for your website badge
2. Recommended dimensions: 88px × 31px (standard badge size)
3. Upload the badge to your website ~~or include it in a PR~~
4. Include the path to your badge in your member entry in the `badge` field
   - For badges hosted on your website: use the full URL (e.g., `https://your-website.com/badge.png`)
   - ~~For badges included in a PR: use a relative path (e.g., `badges/your-custom-badge.svg`)~~

### Badge Examples and Formatting
Badges must be 88x31 pixels or some multiple of this, they can png, .gif, or .svg file types.
[Here](https://cyber.dabamos.de/88x31/index2.html) are some example badge styles you might consider.

## Questions?

- **Who can join?** Any UofT student, alumni, faculty, or staff with a personal website.
- **My website isn't tech-related, can I still join?** Absolutely! The WebRing welcomes websites about any topic.
- **How do I report issues?** Please open an issue on this repository.

## Credits

Inspired by the [XXIIVV WebRing](https://WebRing.xxiivv.com/) and the early web's interconnected spirit.

<div align="center">
  <img width="88" height="31" alt="webring-member" src="https://github.com/user-attachments/assets/bcd44bc1-dd47-4c12-852b-aac3fcf3106d" />
  <img width="251" height="31" alt="join-the-webring" src="https://github.com/user-attachments/assets/8aec4e4f-1777-4058-a700-4a091a10c585" />
  <img width="88" height="31" alt="webring-hardhat" src="https://github.com/user-attachments/assets/8327440c-d5dc-4dde-bebf-1a7b4022a573" />
  <img width="88" height="31" alt="ring" src="https://github.com/user-attachments/assets/d964ad9a-d6a4-4fde-a598-b83d75678252" />
  <br>
  <img src="https://github.com/user-attachments/assets/842176af-1964-47de-9dde-9e747044502a" alt="icon-dark" width="257.5"/>
  <img src="https://github.com/user-attachments/assets/6f41a501-1088-4487-8fbb-81373a58dfe6" alt="icon-light" width="257.5"/>
</div>


