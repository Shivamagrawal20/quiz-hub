#!/bin/bash

# Script to rename badge files to proper naming conventions
# This script will rename files with spaces to use hyphens instead

echo "Renaming badge files to proper naming conventions..."

cd public/badges

# Rename files with spaces to use hyphens
if [ -f "perfect score.svg" ]; then
    mv "perfect score.svg" "perfect-score.svg"
    echo "Renamed: perfect score.svg -> perfect-score.svg"
fi

if [ -f "high scorer.svg" ]; then
    mv "high scorer.svg" "high-scorer.svg"
    echo "Renamed: high scorer.svg -> high-scorer.svg"
fi

if [ -f "first steps.svg" ]; then
    mv "first steps.svg" "first-steps.svg"
    echo "Renamed: first steps.svg -> first-steps.svg"
fi

if [ -f "quiz master 1.svg" ]; then
    mv "quiz master 1.svg" "quiz-master-1.svg"
    echo "Renamed: quiz master 1.svg -> quiz-master-1.svg"
fi

if [ -f "quiz master 2.svg" ]; then
    mv "quiz master 2.svg" "quiz-master-2.svg"
    echo "Renamed: quiz master 2.svg -> quiz-master-2.svg"
fi

if [ -f "quiz master 3.svg" ]; then
    mv "quiz master 3.svg" "quiz-master-3.svg"
    echo "Renamed: quiz master 3.svg -> quiz-master-3.svg"
fi

echo "Renaming complete!"
echo "Current badge files:"
ls -la *.png *.svg 2>/dev/null | grep -E '\.(png|svg)$' 