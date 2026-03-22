require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const MenuItem = require('./models/MenuItem');

const artifactDir = 'C:\\Users\\ayush\\.gemini\\antigravity\\brain\\1c8a6b64-c2ad-4e68-900b-325fbd51e609';
const publicImagesDir = 'c:\\Users\\ayush\\Desktop\\CampusBite0.1\\CampusBite\\campusbite-web\\public\\images';

const imageMapping = {
    // Campus Cafe
    'Cappuccino': 'cappuccino',
    'Club Sandwich': 'club_sandwich',
    'Cold Coffee': 'cold_coffee',
    'Veg Wrap': 'veg_wrap',
    'Brownie Fudge': 'brownie_fudge',
    
    // Kitchen Ette
    'Dal Makhani': 'dal_makhani',
    'Jeera Rice': 'jeera_rice',
    'Kadhai Paneer': 'kadhai_paneer',
    'Butter Naan': 'butter_naan',
    'Gulab Jamun': 'gulab_jamun',
    
    // Oven Express
    'Margherita Pizza': 'margherita_pizza',
    'Pepperoni Pizza': 'pepperoni_pizza',
    'Penne Arrabbiata': 'penne_arrabbiata',
    'Garlic Bread': 'garlic_bread',
    'Choco Lava Cake': 'choco_lava_cake',

    // Campus Fusion
    'Schezwan Pasta': 'schezwan_pasta',
    'Korean Fried Rice': 'korean_fried_rice',

    // Generic fallbacks for the ones that hit Rate Limit
    'Paneer Tacos': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    'Honey Chilli Potato': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80', 
    'Mango Smoothie': 'https://images.unsplash.com/photo-1626082895617-2c6afdaea317?auto=format&fit=crop&w=800&q=80',
    
    // Bengali Bawarchi
    'Machher Jhol': 'https://images.unsplash.com/photo-1599487405270-811cceacfd30?auto=format&fit=crop&w=800&q=80',
    'Moong Dal': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    'Aloo Posto': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    'Mishti Doi': 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    'Roshogolla': 'https://images.unsplash.com/photo-1605197138404-37f2a170fb90?auto=format&fit=crop&w=800&q=80',
    
    // Yummy Meals
    'Full Thali': 'https://images.unsplash.com/photo-1626779816240-f1db1f3eb149?auto=format&fit=crop&w=800&q=80',
    'Mini Thali': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    'Veg Biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    'Dum Aloo': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    'Raita': 'https://images.unsplash.com/photo-1577859714523-5e3e29910d9f?auto=format&fit=crop&w=800&q=80',
};

async function updateDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const items = await MenuItem.find();
        
        let filesInArtifacts = fs.readdirSync(artifactDir);

        for (let item of items) {
            let mappedVal = imageMapping[item.name];
            if (!mappedVal) continue;

            if (mappedVal.startsWith('http')) {
                // External URL fallback
                item.image = mappedVal;
                await item.save();
                console.log(`Updated ${item.name} with external Unsplash URL`);
            } else {
                // Determine the highest timestamp file that starts with mappedVal_
                let matchingFiles = filesInArtifacts.filter(f => f.startsWith(mappedVal + '_') && f.endsWith('.png'));
                if (matchingFiles.length > 0) {
                    matchingFiles.sort();
                    let latestFile = matchingFiles[matchingFiles.length - 1];
                    let sourcePath = path.join(artifactDir, latestFile);
                    let destName = mappedVal + '.png';
                    let destPath = path.join(publicImagesDir, destName);
                    
                    fs.copyFileSync(sourcePath, destPath);
                    
                    item.image = '/images/' + destName;
                    await item.save();
                    console.log(`Updated ${item.name} with local image: /images/${destName}`);
                } else {
                    console.log(`Could not find artifact file for ${item.name} (prefix: ${mappedVal})`);
                }
            }
        }
        console.log("✅ Database update and file copy complete.");
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

updateDB();
