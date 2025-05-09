document.addEventListener("DOMContentLoaded", () => {
  // Check if theme toggle and background toggle are working
  console.log("Webring Tool JS loaded")

  // Get the current theme from body attribute
  const currentTheme = document.body.getAttribute("data-theme") || "light"

  // Set the initial preview container theme to match the page theme
  const previewContainer = document.getElementById("preview-container")
  if (previewContainer) {
    previewContainer.setAttribute("data-theme", currentTheme)
  }
})


document.addEventListener("DOMContentLoaded", () => {
  // Theme Toggle Functionality (from original code)
  const themeToggleBtn = document.getElementById("theme-toggle-btn")
  const bgToggleBtn = document.getElementById("bg-toggle-btn")

  // Check for saved theme preference or prefer-color-scheme
  const savedTheme = localStorage.getItem("theme")
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  // Check for saved background preference, default to off
  const savedBgState = localStorage.getItem("bgEnabled")
  const bgEnabled = savedBgState ? savedBgState === "true" : false // Default to off

  // Apply theme based on saved preference or system preference
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.body.setAttribute("data-theme", "dark")
  }

  // Apply background state based on saved preference
  if (bgEnabled) {
    document.getElementById("background-canvas").style.display = "block"
    bgToggleBtn.className = "bg-toggle-on"
  } else {
    document.getElementById("background-canvas").style.display = "none"
    bgToggleBtn.className = "bg-toggle-off"
  }

  // Toggle theme on button click
  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark"
    document.body.setAttribute("data-theme", currentTheme)
    localStorage.setItem("theme", currentTheme)
  })

  // Toggle background on button click
  bgToggleBtn.addEventListener("click", () => {
    const isEnabled = bgToggleBtn.className === "bg-toggle-on"
    const newState = !isEnabled
    document.getElementById("background-canvas").style.display = newState ? "block" : "none"
    bgToggleBtn.className = newState ? "bg-toggle-on" : "bg-toggle-off"
    localStorage.setItem("bgEnabled", newState)
  })

  // Webring Tool Functionality
  const formatRadios = document.querySelectorAll('input[name="format"]')
  const themeRadios = document.querySelectorAll('input[name="theme"]')
  const arrowStyleRadios = document.querySelectorAll('input[name="arrow-style"]')
  const iconThemeRadios = document.querySelectorAll('input[name="icon-theme"]')
  const customColorsDiv = document.getElementById("custom-colors")
  const customArrowsDiv = document.getElementById("custom-arrows")
  const bgColorInput = document.getElementById("bg-color")
  const textColorInput = document.getElementById("text-color")
  const borderColorInput = document.getElementById("border-color")
  const prevArrowInput = document.getElementById("prev-arrow")
  const nextArrowInput = document.getElementById("next-arrow")
  const spinningIconCheckbox = document.getElementById("spinning-icon")
  const glowingEffectCheckbox = document.getElementById("glowing-effect")
  const textWrapCheckbox = document.getElementById("text-wrap")
  const hoverScaleCheckbox = document.getElementById("hover-scale")
  const roundedCheckbox = document.getElementById("rounded")
  const showBadgeCheckbox = document.getElementById("show-badge")
  const badgeOptionsDiv = document.getElementById("badge-options")
  const badgeTypeRadios = document.querySelectorAll('input[name="badge-type"]')
  const customBadgeUrlDiv = document.getElementById("custom-badge-url")
  const badgeUrlInput = document.getElementById("badge-url")
  const websiteUrlInput = document.getElementById("website-url")
  const elementNameInput = document.getElementById("element-name")
  const generateBtn = document.getElementById("generate-btn")
  const updatePreviewBtn = document.getElementById("update-preview-btn")
  const togglePreviewThemeBtn = document.getElementById("toggle-preview-theme")
  const downloadBtn = document.getElementById("download-btn")
  const previewContainer = document.getElementById("preview-container")
  const htmlEditor = document.getElementById("html-editor")
  const cssEditor = document.getElementById("css-editor")
  const combinedEditor = document.getElementById("combined-editor")
  const badgeEditor = document.getElementById("badge-editor")
  const phpEditor = document.getElementById("php-editor")
  const tabBtns = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")
  const copyBtns = document.querySelectorAll(".copy-btn")
  const toast = document.getElementById("toast")
  const toastMessage = document.getElementById("toast-message")

  // Show/hide custom colors based on theme selection
  themeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "custom") {
        customColorsDiv.classList.remove("hidden")
      } else {
        customColorsDiv.classList.add("hidden")
      }
    })
  })

  // Show/hide custom arrows based on arrow style selection
  arrowStyleRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "custom") {
        customArrowsDiv.classList.remove("hidden")
      } else {
        customArrowsDiv.classList.add("hidden")
      }
    })
  })

  // Show/hide badge options based on show badge checkbox
  showBadgeCheckbox.addEventListener("change", () => {
    if (showBadgeCheckbox.checked) {
      badgeOptionsDiv.classList.remove("hidden")
    } else {
      badgeOptionsDiv.classList.add("hidden")
    }
  })

  // Show/hide custom badge URL based on badge type selection
  badgeTypeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "custom") {
        customBadgeUrlDiv.classList.remove("hidden")
      } else {
        customBadgeUrlDiv.classList.add("hidden")
      }
    })
  })

  // Tab functionality
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all tabs
      tabBtns.forEach((b) => b.classList.remove("active"))
      tabContents.forEach((c) => c.classList.remove("active"))

      // Add active class to clicked tab
      btn.classList.add("active")
      document.getElementById(btn.dataset.tab).classList.add("active")
    })
  })

  // Copy button functionality with modern clipboard API
  copyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target
      const targetElement = document.getElementById(targetId)
      const textToCopy = targetElement.value

      // Use the modern Clipboard API if available
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast("Copied to clipboard!")
        }).catch((err) => {
          console.error("Could not copy text: ", err)
          fallbackCopyTextToClipboard(textToCopy)
        })
      } else {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(textToCopy)
      }
    })
  })

  // Fallback copy method for older browsers
  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.position = "fixed"
    textArea.style.left = "-999999px"
    textArea.style.top = "-999999px"
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand("copy")
      if (successful) {
        showToast("Copied to clipboard!")
      } else {
        showToast("Failed to copy text")
      }
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err)
      showToast("Failed to copy text")
    }

    document.body.removeChild(textArea)
  }

  // Show toast notification
  function showToast(message) {
    toastMessage.textContent = message
    toast.classList.add("show")
    setTimeout(() => {
      toast.classList.remove("show")
    }, 3000)
  }

  // Toggle preview theme
  let previewTheme = "light"
  togglePreviewThemeBtn.addEventListener("click", () => {
    previewTheme = previewTheme === "light" ? "dark" : "light"
    updatePreviewTheme()
  })

  function updatePreviewTheme() {
    if (previewTheme === "dark") {
      previewContainer.style.backgroundColor = "#1a1a1a"
      previewContainer.style.color = "#e0e0e0"
    } else {
      previewContainer.style.backgroundColor = "#ffffff"
      previewContainer.style.color = "#333333"
    }
    generateCode() // Regenerate code to update preview with new theme
  }

  // Generate code
  generateBtn.addEventListener("click", generateCode)

  // Update preview from code editor
  updatePreviewBtn.addEventListener("click", updatePreviewFromEditor)

  // Download files
  downloadBtn.addEventListener("click", downloadFiles)

  // Initial code generation
  generateCode()

  function generateCode() {
    // Get selected options
    const format = document.querySelector('input[name="format"]:checked').value
    const theme = document.querySelector('input[name="theme"]:checked').value
    const iconTheme = document.querySelector('input[name="icon-theme"]:checked')?.value || "light"
    const arrowStyle = document.querySelector('input[name="arrow-style"]:checked').value
    const spinningIcon = spinningIconCheckbox.checked
    const glowingEffect = glowingEffectCheckbox.checked
    const textWrap = textWrapCheckbox.checked
    const hoverScale = hoverScaleCheckbox.checked
    const rounded = roundedCheckbox.checked
    const showBadge = showBadgeCheckbox.checked
    const badgeType = showBadge ? document.querySelector('input[name="badge-type"]:checked').value : "default"
    const customBadgeUrl = badgeUrlInput.value.trim()
    const websiteUrl = websiteUrlInput.value.trim() || "https://your-website.com"
    const elementName = elementNameInput.value.trim() || "default"

    // Get arrows based on style
    const arrows = getArrows(arrowStyle)

    // Get colors based on theme
    const colors = getColors(theme, previewTheme)

    // Generate CSS class name
    const cssClassName = `webring-skuleayan-${elementName}`

    // Generate HTML
    const htmlCode = generateHTML(
      format,
      cssClassName,
      websiteUrl,
      arrows,
      spinningIcon,
      glowingEffect,
      textWrap,
      hoverScale,
      rounded,
      theme,
      iconTheme,
      showBadge,
      badgeType,
      customBadgeUrl,
    )

    // Generate CSS
    const cssCode = generateCSS(
      cssClassName,
      colors,
      spinningIcon,
      glowingEffect,
      textWrap,
      hoverScale,
      rounded,
      showBadge,
    )

    // Generate Badge Code
    const badgeCode = generateBadgeCode(format, websiteUrl, badgeType, customBadgeUrl)

    // Generate PHP Code
    const phpCode = generatePHPCode(
      cssClassName,
      websiteUrl,
      arrows,
      spinningIcon,
      glowingEffect,
      textWrap,
      hoverScale,
      rounded,
      theme,
      iconTheme,
      showBadge,
      badgeType,
      customBadgeUrl,
    )

    // Update editors
    htmlEditor.value = htmlCode
    cssEditor.value = cssCode
    badgeEditor.value = badgeCode
    phpEditor.value = phpCode
    combinedEditor.value =
      format === "html"
        ? `<style>\n${cssCode}\n</style>\n\n${htmlCode}`
        : `{/* CSS */}\n<style>\n${cssCode}\n</style>\n\n{/* Component */}\n${htmlCode}`

    // Update preview
    updatePreview(htmlCode, cssCode)
  }

  function getArrows(style) {
    switch (style) {
      case "double":
        return { prev: "⟸", next: "⟹" }
      case "triangle":
        return { prev: "◀", next: "▶" }
      case "chevron":
        return { prev: "《", next: "》" }
      case "angle":
        return { prev: "⟨", next: "⟩" }
      case "custom":
        return { prev: prevArrowInput.value || "←", next: nextArrowInput.value || "→" }
      case "simple":
      default:
        return { prev: "←", next: "→" }
    }
  }

  function getColors(theme, previewTheme) {
    // For preview, use the preview theme
    let colors;
    if (theme === "auto") {
      // For auto theme, use the current preview theme
      if (previewTheme === "dark") {
        colors = {
          bg: "#2a2a2a",
          text: "#e0e0e0",
          border: "#444444",
        }
      } else {
        colors = {
          bg: "#f5f5f5",
          text: "#333333",
          border: "#dddddd",
        }
      }
    } else if (theme === "custom") {
      colors = {
        bg: bgColorInput.value,
        text: textColorInput.value,
        border: borderColorInput.value,
      }
    } else if (theme === "dark") {
      colors = {
        bg: "#2a2a2a",
        text: "#e0e0e0",
        border: "#444444",
      }
    } else {
      colors = {
        bg: "#f5f5f5",
        text: "#333333",
        border: "#dddddd",
      }
    }
    return colors;
  }

  function getIconPath(theme, iconTheme) {
    // Determine which icon to use based on theme and iconTheme
    if (theme === "dark" || (theme === "auto" && previewTheme === "dark")) {
      return "img/icon-dark.svg"
    } else if (theme === "custom") {
      return iconTheme === "dark" ? "img/icon-dark.svg" : "img/icon.svg"
    } else {
      return "img/icon.svg"
    }
  }

  function generateHTML(
    format,
    className,
    websiteUrl,
    arrows,
    spinningIcon,
    glowingEffect,
    textWrap,
    hoverScale,
    rounded,
    theme,
    iconTheme,
    showBadge,
    badgeType,
    customBadgeUrl,
  ) {
    // Icon path based on theme
    const iconPath = getIconPath(theme, iconTheme)

    // Badge path
    const badgePath =
      badgeType === "custom" && customBadgeUrl ? customBadgeUrl : "badges/default-badge.png"

    if (format === "html") {
      // HTML format
      let html = `<div style="display: flex; align-items: center; gap: 15px; background-color: ${getColors(theme, previewTheme).bg}; padding: 15px 25px; border-radius: ${rounded ? "20px" : "8px"}; border: 1px solid ${getColors(theme, previewTheme).border}; ${textWrap ? "flex-direction: column; text-align: center;" : ""} ${glowingEffect ? "box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);" : ""} ${hoverScale ? "transition: transform 0.2s ease;" : ""}">
    <a href="https://webring.ayanali.net/#${websiteUrl}?nav=prev" style="color: ${getColors(theme, previewTheme).text}; text-decoration: none; font-size: 1.5rem;">${arrows.prev}</a>
    <a href="https://webring.ayanali.net/#${websiteUrl}" target="_blank" ${spinningIcon ? 'style="display: inline-block;"' : ""}>
        <img src="https://webring.ayanali.net/${iconPath}" alt="SKULE Website Phone Book" style="width: 32px; height: 32px; ${spinningIcon ? "transition: transform 2s linear;" : ""}" ${spinningIcon ? "onmouseover=\"this.style.animation='spin 2s linear infinite'\" onmouseout=\"this.style.animation='none'\"" : ""}/>
    </a>
    <a href="https://webring.ayanali.net/#${websiteUrl}?nav=next" style="color: ${getColors(theme, previewTheme).text}; text-decoration: none; font-size: 1.5rem;">${arrows.next}</a>
</div>
${
  showBadge
    ? `\n<a href="https://webring.ayanali.net/#${websiteUrl}" target="_blank">
    <img src="https://webring.ayanali.net/${badgePath}" alt="Member of SKULE Website Phone Book" width="88" height="31" style="margin-top: 10px;" />
</a>`
    : ""
}`

      // Add auto theme detection if theme is auto
      if (theme === "auto") {
        html = `<!-- Auto theme detection -->
<script>
    function updateWebringTheme() {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const webring = document.querySelector('.webring-auto');
        const links = webring.querySelectorAll('a');
        const img = webring.querySelector('img');
        
        if (isDark) {
            webring.style.backgroundColor = '#2a2a2a';
            webring.style.borderColor = '#444444';
            links.forEach(link => link.style.color = '#e0e0e0');
            img.src = 'https://webring.ayanali.net/img/icon-dark.svg';
        } else {
            webring.style.backgroundColor = '#f5f5f5';
            webring.style.borderColor = '#dddddd';
            links.forEach(link => link.style.color = '#333333');
            img.src = 'https://webring.ayanali.net/img/icon.svg';
        }
    }
    
    // Initial theme setup
    document.addEventListener('DOMContentLoaded', updateWebringTheme);
    
    // Listen for theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateWebringTheme);
</script>

<div class="webring-auto" style="display: flex; align-items: center; gap: 15px; padding: 15px 25px; border-radius: ${rounded ? "20px" : "8px"}; border: 1px solid; ${textWrap ? "flex-direction: column; text-align: center;" : ""} ${glowingEffect ? "box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);" : ""} ${hoverScale ? "transition: transform 0.2s ease;" : ""}">
    <a href="https://webring.ayanali.net/#${websiteUrl}?nav=prev" style="text-decoration: none; font-size: 1.5rem;">${arrows.prev}</a>
    <a href="https://webring.ayanali.net/#${websiteUrl}" target="_blank" ${spinningIcon ? 'style="display: inline-block;"' : ""}>
        <img src="https://webring.ayanali.net/img/icon.svg" alt="SKULE Website Phone Book" style="width: 32px; height: 32px; ${spinningIcon ? "transition: transform 2s linear;" : ""}" ${spinningIcon ? "onmouseover=\"this.style.animation='spin 2s linear infinite'\" onmouseout=\"this.style.animation='none'\"" : ""}/>
    </a>
    <a href="https://webring.ayanali.net/#${websiteUrl}?nav=next" style="text-decoration: none; font-size: 1.5rem;">${arrows.next}</a>
</div>
${
  showBadge
    ? `\n<a href="https://webring.ayanali.net/#${websiteUrl}" target="_blank">
    <img src="https://webring.ayanali.net/${badgePath}" alt="Member of SKULE Website Phone Book" width="88" height="31" style="margin-top: 10px;" />
</a>`
    : ""
}`
      }

      // Add spinning animation if needed
      if (spinningIcon) {
        html = `<style>
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
</style>

${html}`
      }

      return html
    } else if (format === "jsx") {
      // JSX format
      let jsx = `<div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  gap: '15px',
  backgroundColor: '${getColors(theme, previewTheme).bg}',
  padding: '15px 25px',
  borderRadius: '${rounded ? "20px" : "8px"}',
  border: '1px solid ${getColors(theme, previewTheme).border}',
  ${textWrap ? "flexDirection: 'column', textAlign: 'center'," : ""}
  ${glowingEffect ? "boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'," : ""}
  ${hoverScale ? "transition: 'transform 0.2s ease'," : ""}
  ${hoverScale ? "':hover': { transform: 'scale(1.05)' }," : ""}
}}>
    <a href={\`https://webring.ayanali.net/#${websiteUrl}?nav=prev\`} style={{ color: '${getColors(theme, previewTheme).text}', textDecoration: 'none', fontSize: '1.5rem' }}>${arrows.prev}</a>
    <a href={\`https://webring.ayanali.net/#${websiteUrl}\`} target="_blank" ${spinningIcon ? "style={{ display: 'inline-block' }}" : ""}>
        <img 
          src={\`https://webring.ayanali.net/${iconPath || "/placeholder.svg"}\`} 
          alt="SKULE Website Phone Book" 
          style={{ 
            width: '32px', 
            height: '32px',
            ${spinningIcon ? "':hover': { animation: 'spin 2s linear infinite' }," : ""}
          }}
        />
    </a>
    <a href={\`https://webring.ayanali.net/#${websiteUrl}?nav=next\`} style={{ color: '${getColors(theme, previewTheme).text}', textDecoration: 'none', fontSize: '1.5rem' }}>${arrows.next}</a>
</div>
${
  showBadge
    ? `\n<a href={\`https://webring.ayanali.net/#${websiteUrl}\`} target="_blank">
    <img src={\`https://webring.ayanali.net/${badgePath || "/placeholder.svg"}\`} alt="Member of SKULE Website Phone Book" width={88} height={31} style={{ marginTop: '10px' }} />
</a>`
    : ""
}`

      // Add auto theme detection if theme is auto
      if (theme === "auto") {
        jsx = `import { useEffect, useState } from 'react';

function WebringElement() {
    const [isDark, setIsDark] = useState(false);
    
    useEffect(() => {
        // Check initial theme
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDark(darkModeMediaQuery.matches);
        
        // Listen for theme changes
        const handleThemeChange = (e) => setIsDark(e.matches);
        darkModeMediaQuery.addEventListener('change', handleThemeChange);
        
        return () => darkModeMediaQuery.removeEventListener('change', handleThemeChange);
    }, []);
    
    return (
        <>
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px',
                backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                padding: '15px 25px',
                borderRadius: '${rounded ? "20px" : "8px"}',
                border: \`1px solid \${isDark ? '#444444' : '#dddddd'}\`,
                ${textWrap ? "flexDirection: 'column', textAlign: 'center'," : ""}
                ${glowingEffect ? "boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'," : ""}
                ${hoverScale ? "transition: 'transform 0.2s ease'," : ""}
                ${hoverScale ? "':hover': { transform: 'scale(1.05)' }," : ""}
            }}>
                <a href={\`https://webring.ayanali.net/#${websiteUrl}?nav=prev\`} style={{ color: isDark ? '#e0e0e0' : '#333333', textDecoration: 'none', fontSize: '1.5rem' }}>${arrows.prev}</a>
                <a href={\`https://webring.ayanali.net/#${websiteUrl}\`} target="_blank" ${spinningIcon ? "style={{ display: 'inline-block' }}" : ""}>
                    <img 
                        src={isDark ? 'https://webring.ayanali.net/img/icon-dark.svg' : 'https://webring.ayanali.net/img/icon.svg'} 
                        alt="SKULE Website Phone Book" 
                        style={{ 
                            width: '32px', 
                            height: '32px',
                            ${spinningIcon ? "':hover': { animation: 'spin 2s linear infinite' }," : ""}
                        }}
                    />
                </a>
                <a href={\`https://webring.ayanali.net/#${websiteUrl}?nav=next\`} style={{ color: isDark ? '#e0e0e0' : '#333333', textDecoration: 'none', fontSize: '1.5rem' }}>${arrows.next}</a>
            </div>
            ${
              showBadge
                ? `\n             <a href={\`https://webring.ayanali.net/#${websiteUrl}\`} target="_blank">
                <img src={\`https://webring.ayanali.net/${badgePath || "/placeholder.svg"}\`} alt="Member of SKULE Website Phone Book" width={88} height={31} style={{ marginTop: '10px' }} />
            </a>`
                : ""
            }
        </>
    );
}

export default WebringElement;`
      } else {
        // Wrap in component if not auto theme
        jsx = `function WebringElement() {
    return (
        <>
            ${jsx}
        </>
    );
}

export default WebringElement;`
      }

      // Add spinning animation if needed
      if (spinningIcon) {
        jsx = `// Add this to your global CSS or component styles
{/* 
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
*/}

${jsx}`
      }

      return jsx
    } else if (format === "tsx") {
      // TSX format
      let tsx = `<div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  gap: '15px',
  backgroundColor: '${getColors(theme, previewTheme).bg}',
  padding: '15px 25px',
  borderRadius: '${rounded ? "20px" : "8px"}',
  border: '1px solid ${getColors(theme, previewTheme).border}',
  ${textWrap ? "flexDirection: 'column', textAlign: 'center'," : ""}
  ${glowingEffect ? "boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'," : ""}
  ${hoverScale ? "transition: 'transform 0.2s ease'," : ""}
  ${hoverScale ? "':hover': { transform: 'scale(1.05)' }," : ""}
}}>
    <a href={\`https://webring.ayanali.net/#${websiteUrl}?nav=prev\`} style={{ color: '${getColors(theme, previewTheme).text}', textDecoration: 'none', fontSize: '1.5rem' }}>${arrows.prev}</a>
    <a href={\`https://webring.ayanali.net/#${websiteUrl}\`} target="_blank" ${spinningIcon ? "style={{ display: 'inline-block' }}" : ""}>
        <img 
          src={\`https://webring.ayanali.net/${iconPath || "/placeholder.svg"}\`} 
          alt="SKULE Website Phone Book" 
          style={{ 
            width: '32px', 
            height: '32px',
            ${spinningIcon ? "':hover': { animation: 'spin 2s linear infinite' }," : ""}
          }}
        />
    </a>
    <a href={\`https://webring.ayanali.net/#${websiteUrl}?nav=next\`} style={{ color: '${getColors(theme, previewTheme).text}', textDecoration: 'none', fontSize: '1.5rem' }}>${arrows.next}</a>
</div>
${
  showBadge
    ? `\n<a href={\`https://webring.ayanali.net/#${websiteUrl}\`} target="_blank">
    <img src={\`https://webring.ayanali.net/${badgePath || "/placeholder.svg"}\`} alt="Member of SKULE Website Phone Book" width={88} height={31} style={{ marginTop: '10px' }} />
</a>`
    : ""
}`

      // Add auto theme detection if theme is auto
      if (theme === "auto") {
        tsx = `import React, { useEffect, useState } from 'react';

const WebringElement: React.FC = () => {
    const [isDark, setIsDark] = useState<boolean>(false);
    
    useEffect(() => {
        // Check initial theme
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDark(darkModeMediaQuery.matches);
        
        // Listen for theme changes
        const handleThemeChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
        darkModeMediaQuery.addEventListener('change', handleThemeChange);
        
        return () => darkModeMediaQuery.removeEventListener('change', handleThemeChange);
    }, []);
    
    return (
        <>
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px',
                backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                padding: '15px 25px',
                borderRadius: '${rounded ? "20px" : "8px"}',
                border: \`1px solid \${isDark ? '#444444' : '#dddddd'}\`,
                ${textWrap ? "flexDirection: 'column', textAlign: 'center'," : ""}
                ${glowingEffect ? "boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'," : ""}
                ${hoverScale ? "transition: 'transform 0.2s ease'," : ""}
                ${hoverScale ? "':hover': { transform: 'scale(1.05)' }," : ""}
            }}>
                <a href={\`https://webring.ayanali.net/#${websiteUrl}?nav=prev\`} style={{ color: isDark ? '#e0e0e0' : '#333333', textDecoration: 'none', fontSize: '1.5rem' }}>${arrows.prev}</a>
                <a href={\`https://webring.ayanali.net/#${websiteUrl}\`} target="_blank" ${spinningIcon ? "style={{ display: 'inline-block' }}" : ""}>
                    <img 
                        src={isDark ? 'https://webring.ayanali.net/img/icon-dark.svg' : 'https://webring.ayanali.net/img/icon.svg'} 
                        alt="SKULE Website Phone Book" 
                        style={{ 
                            width: '32px', 
                            height: '32px',
                            ${spinningIcon ? "':hover': { animation: 'spin 2s linear infinite' }," : ""}
                        }}
                    />
                </a>
                <a href={\`https://webring.ayanali.net/#${websiteUrl}?nav=next\`} style={{ color: isDark ? '#e0e0e0' : '#333333', textDecoration: 'none', fontSize: '1.5rem' }}>${arrows.next}</a>
            </div>
            ${
              showBadge
                ? `\n            <a href={\`https://webring.ayanali.net/#${websiteUrl}\`} target="_blank">
                <img src={\`https://webring.ayanali.net/${badgePath || "/placeholder.svg"}\`} alt="Member of SKULE Website Phone Book" width={88} height={31} style={{ marginTop: '10px' }} />
            </a>`
                : ""
            }
        </>
    );
};

export default WebringElement;`
      } else {
        // Wrap in component if not auto theme
        tsx = `import React from 'react';

const WebringElement: React.FC = () => {
    return (
        <>
            ${tsx}
        </>
    );
};

export default WebringElement;`
      }

      // Add spinning animation if needed
      if (spinningIcon) {
        tsx = `// Add this to your global CSS or component styles
{/* 
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
*/}

${tsx}`
      }

      return tsx
    } else {
      // PHP format (beta)
      let php = `<?php
/**
 * SKULE Website Phone Book - Webring Element
 * 
 * This code generates a webring element for the SKULE Website Phone Book.
 * Replace 'your-website.com' with your actual website URL.
 */

// Define your website URL
$websiteUrl = '${websiteUrl}';

// Get the current theme (you can implement your own theme detection logic)
$isDark = false; // Set to true for dark theme, false for light theme
${theme === "auto" ? "// You can use PHP to detect system theme preference if your server supports it" : ""}

// Define colors based on theme
${
  theme === "custom"
    ? `$bgColor = '${colors.bg}';
$textColor = '${colors.text}';
$borderColor = '${colors.border}';`
    : theme === "dark"
    ? `$bgColor = '#2a2a2a';
$textColor = '#e0e0e0';
$borderColor = '#444444';`
    : theme === "auto"
    ? `if ($isDark) {
    $bgColor = '#2a2a2a';
    $textColor = '#e0e0e0';
    $borderColor = '#444444';
} else {
    $bgColor = '#f5f5f5';
    $textColor = '#333333';
    $borderColor = '#dddddd';
}`
    : `$bgColor = '#f5f5f5';
$textColor = '#333333';
$borderColor = '#dddddd';`
}

// Define icon path
${
  theme === "custom"
    ? `$iconPath = '${iconTheme === "dark" ? "img/icon-dark.svg" : "img/icon.svg"}';`
    : theme === "dark"
    ? `$iconPath = 'img/icon-dark.svg';`
    : theme === "auto"
    ? `$iconPath = $isDark ? 'img/icon-dark.svg' : 'img/icon.svg';`
    : `$iconPath = 'img/icon.svg';`
}

// Define badge path
${
  showBadge
    ? `$badgePath = '${badgeType === "custom" && customBadgeUrl ? customBadgeUrl : "badges/default-badge.png"}';`
    : ""
}

// Generate the HTML for the webring element
?>

<!-- Webring Element -->
${spinningIcon ? `<style>
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
</style>
` : ""}
<div style="display: flex; align-items: center; gap: 15px; background-color: <?php echo $bgColor; ?>; padding: 15px 25px; border-radius: ${rounded ? "20px" : "8px"}; border: 1px solid <?php echo $borderColor; ?>; ${textWrap ? "flex-direction: column; text-align: center;" : ""} ${glowingEffect ? "box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);" : ""} ${hoverScale ? "transition: transform 0.2s ease;" : ""}">
    <a href="https://webring.ayanali.net/#<?php echo $websiteUrl; ?>?nav=prev" style="color: <?php echo $textColor; ?>; text-decoration: none; font-size: 1.5rem;">${arrows.prev}</a>
    <a href="https://webring.ayanali.net/#<?php echo $websiteUrl; ?>" target="_blank" ${spinningIcon ? 'style="display: inline-block;"' : ""}>
        <img src="https://webring.ayanali.net/<?php echo $iconPath; ?>" alt="SKULE Website Phone Book" style="width: 32px; height: 32px; ${spinningIcon ? "transition: transform 2s linear;" : ""}" ${spinningIcon ? "onmouseover=\"this.style.animation='spin 2s linear infinite'\" onmouseout=\"this.style.animation='none'\"" : ""}/>
    </a>
    <a href="https://webring.ayanali.net/#<?php echo $websiteUrl; ?>?nav=next" style="color: <?php echo $textColor; ?>; text-decoration: none; font-size: 1.5rem;">${arrows.next}</a>
</div>
${
  showBadge
    ? `\n<a href="https://webring.ayanali.net/#<?php echo $websiteUrl; ?>" target="_blank">
    <img src="https://webring.ayanali.net/<?php echo $badgePath; ?>" alt="Member of SKULE Website Phone Book" width="88" height="31" style="margin-top: 10px;" />
</a>`
    : ""
}`

      return php
    }
  }

  function generateCSS(className, colors, spinningIcon, glowingEffect, textWrap, hoverScale, rounded, showBadge) {
    let css = `.${className} {
    display: inline-flex;
    align-items: center;
    gap: 15px;
    background-color: ${colors.bg};
    padding: 15px 25px;
    border-radius: ${rounded ? "20px" : "8px"};
    border: 1px solid ${colors.border};
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    ${textWrap ? "flex-direction: column; text-align: center;" : ""}
    ${glowingEffect ? "box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); transition: box-shadow 0.3s ease;" : ""}
    ${hoverScale ? "transition: transform 0.2s ease;" : ""}
}

.${className} a {
    color: ${colors.text};
    text-decoration: none;
    font-size: 1.5rem;
}

.${className} img {
    width: 32px;
    height: 32px;
}`

    // Add hover effects
    if (hoverScale) {
      css += `\n
.${className}:hover {
    transform: scale(1.05);
}`
    }

    if (glowingEffect) {
      css += `\n
.${className}:hover {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}`
    }

    // Add spinning icon effect
    if (spinningIcon) {
      css += `\n
@keyframes ${className}-spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.${className} a:hover img {
    animation: ${className}-spin 2s linear infinite;
}`
    }

    // Add badge styles if needed
    if (showBadge) {
      css += `\n
.${className}-badge {
    display: block;
    width: 88px;
    height: 31px;
    margin-top: 10px;
}`
    }

    return css
  }

  function generateBadgeCode(format, websiteUrl, badgeType, customBadgeUrl) {
    const badgePath =
      badgeType === "custom" && customBadgeUrl ? customBadgeUrl : "badges/default-badge.png"

    if (format === "html") {
      return `<a href="https://webring.ayanali.net/#${websiteUrl}" target="_blank">
    <img src="https://webring.ayanali.net/${badgePath}" alt="Member of SKULE Website Phone Book" width="88" height="31" />
</a>`
    } else if (format === "jsx" || format === "tsx") {
      return `<a href={\`https://webring.ayanali.net/#${websiteUrl}\`} target="_blank">
    <img src={\`https://webring.ayanali.net/${badgePath || "/placeholder.svg"}\`} alt="Member of SKULE Website Phone Book" width={88} height={31} />
</a>`
    } else if (format === "php") {
      return `<?php
$websiteUrl = '${websiteUrl}';
$badgePath = '${badgePath}';
?>

<a href="https://webring.ayanali.net/#<?php echo $websiteUrl; ?>" target="_blank">
    <img src="https://webring.ayanali.net/<?php echo $badgePath; ?>" alt="Member of SKULE Website Phone Book" width="88" height="31" />
</a>`
    }
  }

  function generatePHPCode(
    className,
    websiteUrl,
    arrows,
    spinningIcon,
    glowingEffect,
    textWrap,
    hoverScale,
    rounded,
    theme,
    iconTheme,
    showBadge,
    badgeType,
    customBadgeUrl,
  ) {
    const colors = getColors(theme, previewTheme)
    const badgePath =
      badgeType === "custom" && customBadgeUrl ? customBadgeUrl : "badges/default-badge.png"

    return `<?php
/**
 * SKULE Website Phone Book - Webring Element
 * 
 * This code generates a webring element for the SKULE Website Phone Book.
 * Replace 'your-website.com' with your actual website URL.
 */

// Define your website URL
$websiteUrl = '${websiteUrl}';

// Get the current theme (you can implement your own theme detection logic)
$isDark = false; // Set to true for dark theme, false for light theme
${theme === "auto" ? "// You can use PHP to detect system theme preference if your server supports it" : ""}

// Define colors based on theme
${
  theme === "custom"
    ? `$bgColor = '${colors.bg}';
$textColor = '${colors.text}';
$borderColor = '${colors.border}';`
    : theme === "dark"
    ? `$bgColor = '#2a2a2a';
$textColor = '#e0e0e0';
$borderColor = '#444444';`
    : theme === "auto"
    ? `if ($isDark) {
    $bgColor = '#2a2a2a';
    $textColor = '#e0e0e0';
    $borderColor = '#444444';
} else {
    $bgColor = '#f5f5f5';
    $textColor = '#333333';
    $borderColor = '#dddddd';
}`
    : `$bgColor = '#f5f5f5';
$textColor = '#333333';
$borderColor = '#dddddd';`
}

// Define icon path
${
  theme === "custom"
    ? `$iconPath = '${iconTheme === "dark" ? "img/icon-dark.svg" : "img/icon.svg"}';`
    : theme === "dark"
    ? `$iconPath = 'img/icon-dark.svg';`
    : theme === "auto"
    ? `$iconPath = $isDark ? 'img/icon-dark.svg' : 'img/icon.svg';`
    : `$iconPath = 'img/icon.svg';`
}

// Define badge path
${
  showBadge
    ? `$badgePath = '${badgePath}';`
    : ""
}

// Define arrow styles
$prevArrow = '${arrows.prev}';
$nextArrow = '${arrows.next}';

// Generate CSS for the webring element
$css = <<<EOT
${spinningIcon ? `@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
` : ""}
.${className} {
    display: inline-flex;
    align-items: center;
    gap: 15px;
    background-color: \$bgColor;
    padding: 15px 25px;
    border-radius: ${rounded ? "20px" : "8px"};
    border: 1px solid \$borderColor;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    ${textWrap ? "flex-direction: column; text-align: center;" : ""}
    ${glowingEffect ? "box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); transition: box-shadow 0.3s ease;" : ""}
    ${hoverScale ? "transition: transform 0.2s ease;" : ""}
}

.${className} a {
    color: \$textColor;
    text-decoration: none;
    font-size: 1.5rem;
}

.${className} img {
    width: 32px;
    height: 32px;
}
${
  hoverScale
    ? `
.${className}:hover {
    transform: scale(1.05);
}`
    : ""
}
${
  glowingEffect
    ? `
.${className}:hover {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}`
    : ""
}
${
  spinningIcon
    ? `
.${className} a:hover img {
    animation: spin 2s linear infinite;
}`
    : ""
}
${
  showBadge
    ? `
.${className}-badge {
    display: block;
    width: 88px;
    height: 31px;
    margin-top: 10px;
}`
    : ""
}
EOT;

// Output the CSS and HTML
?>
<style>
<?php echo $css; ?>
</style>

<div class="<?php echo '${className}'; ?>">
    <a href="https://webring.ayanali.net/#<?php echo $websiteUrl; ?>?nav=prev"><?php echo $prevArrow; ?></a>
    <a href="https://webring.ayanali.net/#<?php echo $websiteUrl; ?>" target="_blank">
        <img src="https://webring.ayanali.net/<?php echo $iconPath; ?>" alt="SKULE Website Phone Book" />
    </a>
    <a href="https://webring.ayanali.net/#<?php echo $websiteUrl; ?>?nav=next"><?php echo $nextArrow; ?></a>
</div>
${
  showBadge
    ? `
<a href="https://webring.ayanali.net/#<?php echo $websiteUrl; ?>" target="_blank" class="${className}-badge">
    <img src="https://webring.ayanali.net/<?php echo $badgePath; ?>" alt="Member of SKULE Website Phone Book" width="88" height="31" />
</a>`
    : ""
}`
  }

  function updatePreview(htmlCode, cssCode) {
    // Create a style element for the CSS
    const styleElement = document.createElement("style")
    styleElement.textContent = cssCode

    // Clear the preview container
    previewContainer.innerHTML = ""

    // Add the style element
    previewContainer.appendChild(styleElement)

    // Add the HTML
    previewContainer.insertAdjacentHTML("beforeend", htmlCode)

    // Add spinning animation if needed
    if (htmlCode.includes("spin")) {
      const spinStyle = document.createElement("style")
      spinStyle.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `
      previewContainer.appendChild(spinStyle)
    }
  }

  function updatePreviewFromEditor() {
    const activeTab = document.querySelector(".tab-content.active")
    const tabId = activeTab.id

    if (tabId === "html-code") {
      // Update from HTML editor only
      updatePreview(htmlEditor.value, cssEditor.value)
    } else if (tabId === "css-code") {
      // Update from CSS editor only
      updatePreview(htmlEditor.value, cssEditor.value)
    } else if (tabId === "combined-code") {
      // Parse combined code
      const combinedCode = combinedEditor.value
      const cssMatch = combinedCode.match(/<style>([\s\S]*?)<\/style>/)
      const htmlMatch = combinedCode.match(/<\/style>\s*\n\s*\n([\s\S]*)/)

      if (cssMatch && htmlMatch) {
        const cssCode = cssMatch[1].trim()
        const htmlCode = htmlMatch[1].trim()

        // Update editors
        htmlEditor.value = htmlCode
        cssEditor.value = cssCode

        // Update preview
        updatePreview(htmlCode, cssCode)
      } else {
        showToast("Could not parse combined code. Make sure it contains both <style> tags and HTML.")
      }
    } else if (tabId === "badge-code") {
      // Just update the badge code preview
      const badgeCode = badgeEditor.value
      const previewDiv = document.createElement("div")
      previewDiv.innerHTML = badgeCode

      // Clear the preview container
      previewContainer.innerHTML = ""

      // Add the badge
      previewContainer.appendChild(previewDiv)
    } else if (tabId === "php-code") {
      // Show a message that PHP preview is not available
      previewContainer.innerHTML = "<div style='text-align: center; padding: 20px;'><p>PHP preview is not available in the browser.</p><p>Please copy the code and test it on your PHP server.</p></div>"
    }
  }

  function downloadFiles() {
    // Get the current code
    const htmlCode = htmlEditor.value
    const cssCode = cssEditor.value
    const combinedCode = combinedEditor.value
    const badgeCode = badgeEditor.value
    const phpCode = phpEditor.value
    const elementName = elementNameInput.value.trim() || "default"

    // Create HTML file
    const htmlBlob = new Blob([htmlCode], { type: "text/html" })
    const htmlUrl = URL.createObjectURL(htmlBlob)
    const htmlLink = document.createElement("a")
    htmlLink.href = htmlUrl
    htmlLink.download = `webring-${elementName}.html`

    // Create CSS file
    const cssBlob = new Blob([cssCode], { type: "text/css" })
    const cssUrl = URL.createObjectURL(cssBlob)
    const cssLink = document.createElement("a")
    cssLink.href = cssUrl
    cssLink.download = `webring-${elementName}.css`

    // Create combined file
    const combinedBlob = new Blob([combinedCode], { type: "text/html" })
    const combinedUrl = URL.createObjectURL(combinedBlob)
    const combinedLink = document.createElement("a")
    combinedLink.href = combinedUrl
    combinedLink.download = `webring-${elementName}-combined.html`

    // Create badge file
    const badgeBlob = new Blob([badgeCode], { type: "text/html" })
    const badgeUrl = URL.createObjectURL(badgeBlob)
    const badgeLink = document.createElement("a")
    badgeLink.href = badgeUrl
    badgeLink.download = `webring-${elementName}-badge.html`

    // Create PHP file
    const phpBlob = new Blob([phpCode], { type: "text/php" })
    const phpUrl = URL.createObjectURL(phpBlob)
    const phpLink = document.createElement("a")
    phpLink.href = phpUrl
    phpLink.download = `webring-${elementName}.php`

    // Download files
    htmlLink.click()
    setTimeout(() => cssLink.click(), 100)
    setTimeout(() => combinedLink.click(), 200)
    setTimeout(() => badgeLink.click(), 300)
    setTimeout(() => phpLink.click(), 400)

    // Show toast notification
    showToast("Files downloaded successfully!")

    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(htmlUrl)
      URL.revokeObjectURL(cssUrl)
      URL.revokeObjectURL(combinedUrl)
      URL.revokeObjectURL(badgeUrl)
      URL.revokeObjectURL(phpUrl)
    }, 1000)
  }
})