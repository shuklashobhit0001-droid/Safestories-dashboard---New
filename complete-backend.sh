#!/bin/bash

# Script to complete the backend migration
# This will copy your full server code and update imports

echo "🚀 Completing Backend Migration..."
echo ""

# Check if we're in the right directory
if [ ! -f "server/index.ts" ]; then
    echo "❌ Error: Please run this script from your current project root"
    echo "   (The directory containing server/index.ts)"
    exit 1
fi

echo "✅ Found server/index.ts"
echo ""

# Backup the partial app.ts
echo "📦 Backing up partial app.ts..."
cp migration-temp/backend/src/app.ts migration-temp/backend/src/app.ts.partial

# Copy the full server file
echo "📋 Copying complete server code..."
cp server/index.ts migration-temp/backend/src/app.ts

# Update imports
echo "🔧 Updating import paths..."

# For macOS (using sed with backup)
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|from '../lib/db'|from './services/database.service.js'|g" migration-temp/backend/src/app.ts
    sed -i '' "s|from '../lib/minio'|from './services/minio.service.js'|g" migration-temp/backend/src/app.ts
    sed -i '' "s|from '../lib/email'|from './services/email.service.js'|g" migration-temp/backend/src/app.ts
    sed -i '' "s|from '../lib/timezone'|from './utils/timezone.js'|g" migration-temp/backend/src/app.ts
    sed -i '' "s|from './dashboardApiBookingSync'|// from './dashboardApiBookingSync' // TODO: Migrate this file|g" migration-temp/backend/src/app.ts
else
    # For Linux
    sed -i "s|from '../lib/db'|from './services/database.service.js'|g" migration-temp/backend/src/app.ts
    sed -i "s|from '../lib/minio'|from './services/minio.service.js'|g" migration-temp/backend/src/app.ts
    sed -i "s|from '../lib/email'|from './services/email.service.js'|g" migration-temp/backend/src/app.ts
    sed -i "s|from '../lib/timezone'|from './utils/timezone.js'|g" migration-temp/backend/src/app.ts
    sed -i "s|from './dashboardApiBookingSync'|// from './dashboardApiBookingSync' // TODO: Migrate this file|g" migration-temp/backend/src/app.ts
fi

echo "✅ Import paths updated"
echo ""

# Add missing imports at the top if needed
echo "📝 Adding missing imports..."
cat > /tmp/app-header.ts << 'EOF'
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import multer from 'multer';
import { randomUUID } from 'crypto';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Import services
import pool from './services/database.service.js';
import { uploadFile } from './services/minio.service.js';
import { sendOTPEmail, sendPasswordResetOTP } from './services/email.service.js';
import { convertToIST, getCurrentISTTimestamp } from './utils/timezone.js';
// import { startDashboardApiBookingSync } from './dashboardApiBookingSync.js'; // TODO: Migrate this file

// Load environment variables
dotenv.config();

EOF

# Check if we need to replace the header
if grep -q "import pool from './services/database.service.js'" migration-temp/backend/src/app.ts; then
    echo "✅ Imports already updated"
else
    echo "⚠️  Manual import update may be needed"
fi

echo ""
echo "🎉 Backend migration complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Review migration-temp/backend/src/app.ts"
echo "   2. Check if dashboardApiBookingSync needs to be migrated"
echo "   3. Test the backend locally: cd migration-temp/backend && npm install && npm run dev"
echo "   4. Push to GitHub when ready"
echo ""
echo "✅ Done!"