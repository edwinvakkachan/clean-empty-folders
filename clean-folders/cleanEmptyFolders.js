const fs = require('fs');
const path = require('path');

const MEDIA_ROOT = path.join(__dirname, 'media');

function cleanEmptyFolders() {
    console.log('🟢 Starting safe folder cleanup...');

    // Get all non-hidden folders
    const folders = fs.readdirSync(MEDIA_ROOT).filter(folder => {
        return fs.statSync(path.join(MEDIA_ROOT, folder)).isDirectory() && 
               !folder.startsWith('.');  // Skip hidden folders
    });

    if (folders.length === 0) {
        console.log('ℹ️ No folders to process');
        return;
    }

    console.log(`Found ${folders.length} folders to check`);

    folders.forEach(folder => {
        const folderPath = path.join(MEDIA_ROOT, folder);
        
        try {
            // Skip if folder starts with '.' (extra protection)
            if (folder.startsWith('.')) {
                console.log(`🔒 Skipping hidden folder: ${folder}`);
                return;
            }

            // Get all files (including hidden ones)
            const files = fs.readdirSync(folderPath);
            const hasMp4 = files.some(file => file.endsWith('.mp4'));
            
            if (!hasMp4) {
                console.log(`\n📁 Deleting folder (no MP4): ${folder}`);
                
                // Delete all contents first (including hidden files)
                files.forEach(file => {
                    try {
                        fs.rmSync(path.join(folderPath, file), { recursive: true, force: true });
                        console.log(`   🗑️ Deleted: ${file}`);
                    } catch (err) {
                        console.error(`   ❌ Failed to delete ${file}:`, err.message);
                    }
                });

                // Then delete the folder itself
                fs.rmdirSync(folderPath);
                console.log(`✅ Successfully deleted folder: ${folder}`);
            } else {
                console.log(`\n🔷 Keeping folder ${folder} (contains MP4 files)`);
            }
        } catch (err) {
            console.error(`❌ Error processing ${folder}:`, err.message);
        }
    });

    console.log('\n✅ Folder cleanup completed');
}

cleanEmptyFolders();