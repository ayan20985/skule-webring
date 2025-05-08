const fs = require('fs');
const path = require('path');

// Members data directly included
const members = [
    {
        name: "Sophia Lin",
        website: "https://sophialin.ca",
        faculty: "Engineering",
        designation: "Undergrad",
        year: "1-25",
        grad: "2T6"
    },
    {
        name: "Michael Rodriguez",
        website: "https://mikecodes.dev",
        faculty: "Computer Science",
        designation: "Graduate",
        year: "1-25",
        grad: "2T4"
    },
    {
        name: "Dr. Priya Sharma",
        website: "https://priyasharma.research.ca",
        faculty: "Medicine",
        designation: "Faculty",
        year: "1-25",
        grad: "N/A"
    },
    {
        name: "Ahmed Khan",
        website: "https://ahmed-khan.me",
        faculty: "Arts & Science",
        designation: "Undergrad",
        year: "1-25",
        grad: "2T5"
    },
    {
        name: "Taylor Williams",
        website: "https://taylorwilliams.design",
        faculty: "Architecture",
        designation: "Alumni",
        year: "1-25",
        grad: "1T9"
    },
    {
        name: "John Doe",
        website: "https://johndoe.example.com",
        faculty: "Engineering",
        designation: "Undergrad",
        year: "1-25",
        grad: "2T5"
    },
    {
        name: "Jane Smith",
        website: "https://janesmith.example.com",
        faculty: "Arts & Science",
        designation: "Graduate",
        year: "1-25",
        grad: "2T3"
    },
    {
        name: "Alex Johnson",
        website: "https://alexjohnson.example.com",
        faculty: "Computer Science",
        designation: "Faculty",
        year: "1-25",
        grad: "N/A"
    },
    {
        name: "Wei Chen",
        website: "https://weichen.dev",
        faculty: "Computer Science",
        designation: "Graduate",
        year: "1-25",
        grad: "2T4"
    },
    {
        name: "Olivia Patel",
        website: "https://oliviapatel.ca",
        faculty: "Pharmacy",
        designation: "Undergrad",
        year: "1-25",
        grad: "2T7"
    },
    {
        name: "Marcus Thompson",
        website: "https://marcusmakes.tech",
        faculty: "Engineering",
        designation: "Undergrad",
        year: "1-25",
        grad: "2T5"
    },
    {
        name: "Fatima Al-Zahra",
        website: "https://fatimaalzahra.com",
        faculty: "Law",
        designation: "Graduate",
        year: "1-25",
        grad: "2T3"
    },
    {
        name: "Prof. David Kim",
        website: "https://davidkim.research.utoronto.ca",
        faculty: "Physics",
        designation: "Faculty",
        year: "1-25",
        grad: "N/A"
    },
    {
        name: "Zoe Winters",
        website: "https://zoewinters.art",
        faculty: "Fine Arts",
        designation: "Alumni",
        year: "1-25",
        grad: "2T0"
    },
    {
        name: "Carlos Mendoza",
        website: "https://carlos.codes",
        faculty: "Information",
        designation: "Graduate",
        year: "1-25",
        grad: "2T4"
    },
    {
        name: "Elena Petrov",
        website: "https://elenawrites.net",
        faculty: "Arts & Science",
        designation: "Undergrad",
        year: "1-25",
        grad: "2T6"
    },
    {
        name: "Jordan Lee",
        website: "https://jordanlee.bio",
        faculty: "Life Sciences",
        designation: "Undergrad",
        year: "1-25",
        grad: "2T7"
    },
    {
        name: "Dr. Sarah Cohen",
        website: "https://drsarahcohen.med.ca",
        faculty: "Medicine",
        designation: "Faculty",
        year: "1-25",
        grad: "N/A"
    },
    {
        name: "Raj Patel",
        website: "https://rajpatel.tech",
        faculty: "Engineering",
        designation: "Alumni",
        year: "1-25",
        grad: "1T8"
    },
    {
        name: "Aisha Muhammad",
        website: "https://aishamuhammad.design",
        faculty: "Architecture",
        designation: "Graduate",
        year: "1-25",
        grad: "2T3"
    },
    {
        name: "Lucas Fernandez",
        website: "https://lucasfernandez.me",
        faculty: "Music",
        designation: "Undergrad",
        year: "1-25",
        grad: "2T5"
    },
    {
        name: "Min-Ji Park",
        website: "https://minji.dev",
        faculty: "Computer Science",
        designation: "Alumni",
        year: "1-25",
        grad: "2T1"
    },
    {
        name: "Thomas O'Connor",
        website: "https://thomasoconnor.ca",
        faculty: "Business",
        designation: "Graduate",
        year: "1-25",
        grad: "2T4"
    }
];

// Read template HTML
const templatePath = path.join(__dirname, 'template.html');
const template = fs.readFileSync(templatePath, 'utf8');

// Create directory for each member and generate their HTML
members.forEach(member => {
    // Extract domain for folder name (removing https:// and trailing slashes)
    const domain = member.website.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const folderName = domain.replace(/\./g, '-');
    const folderPath = path.join(__dirname, folderName);
    
    // Create folder
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
    
    // Replace placeholders in template
    let memberHTML = template
        .replace(/{{NAME}}/g, member.name)
        .replace(/{{FACULTY}}/g, member.faculty)
        .replace(/{{DESIGNATION}}/g, member.designation)
        .replace(/{{GRAD}}/g, member.grad)
        .replace(/{{WEBSITE}}/g, member.website);
    
    // Write index.html file
    fs.writeFileSync(path.join(folderPath, 'index.html'), memberHTML);
    
    console.log(`Created placeholder site for ${member.name} at ${folderPath}`);
});

console.log('All placeholder sites have been generated!'); 