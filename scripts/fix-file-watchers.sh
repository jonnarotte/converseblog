#!/bin/bash

# Fix macOS file watcher limit for Jest watch mode
# Run this once to increase the limit permanently

echo "🔧 Fixing macOS file watcher limit..."

# Check current limit
CURRENT_LIMIT=$(ulimit -n)
echo "Current limit: $CURRENT_LIMIT"

# Check shell config file
if [ -f ~/.zshrc ]; then
    CONFIG_FILE=~/.zshrc
elif [ -f ~/.bash_profile ]; then
    CONFIG_FILE=~/.bash_profile
else
    CONFIG_FILE=~/.zshrc
    touch $CONFIG_FILE
fi

# Add to config if not already present
if ! grep -q "ulimit -n 4096" $CONFIG_FILE; then
    echo "" >> $CONFIG_FILE
    echo "# Increase file watcher limit for Jest/testing" >> $CONFIG_FILE
    echo "ulimit -n 4096" >> $CONFIG_FILE
    echo "✅ Added to $CONFIG_FILE"
else
    echo "✅ Already configured in $CONFIG_FILE"
fi

# Apply for current session
ulimit -n 4096
echo "✅ Current session limit set to: $(ulimit -n)"
echo ""
echo "📝 To apply permanently, restart your terminal or run:"
echo "   source $CONFIG_FILE"
