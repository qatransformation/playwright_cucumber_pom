#!/bin/bash

# Script to show project structure
# Usage: ./show-structure.sh

echo "======================================"
echo "  PROJECT STRUCTURE"
echo "======================================"
echo ""

echo "📂 FEATURES (Gherkin/BDD)"
echo "-------------------"
find features -name "*.feature" -type f 2>/dev/null | sort
echo ""

echo "📂 PAGE OBJECTS (POM)"
echo "-------------------"
find src/pages -name "*.ts" -type f 2>/dev/null | sort
echo ""

echo "📂 STEP DEFINITIONS"
echo "-------------------"
find src/steps -name "*.ts" -type f 2>/dev/null | sort
echo ""

echo "📂 SUPPORT (World & Hooks)"
echo "-------------------"
find src/support -name "*.ts" -type f 2>/dev/null | sort
echo ""

echo "📂 UTILITIES"
echo "-------------------"
find src/utils -name "*.ts" -type f 2>/dev/null | sort
echo ""

echo "📂 TEST DATA"
echo "-------------------"
find test-data -type f 2>/dev/null | sort
echo ""

echo "📄 CONFIGURATION"
echo "-------------------"
ls -1 *.js *.ts *.json 2>/dev/null | grep -E "(cucumber|playwright|tsconfig|package)" | sort
echo ""

echo "📖 DOCUMENTATION"
echo "-------------------"
ls -1 *.md 2>/dev/null | sort
echo ""

echo "======================================"
echo "  SUMMARY"
echo "======================================"
echo "Features:       $(find features -name '*.feature' 2>/dev/null | wc -l | tr -d ' ')"
echo "Page Objects:   $(find src/pages -name '*.ts' 2>/dev/null | wc -l | tr -d ' ')"
echo "Steps:          $(find src/steps -name '*.ts' 2>/dev/null | wc -l | tr -d ' ')"
echo "Utilities:      $(find src/utils -name '*.ts' 2>/dev/null | wc -l | tr -d ' ')"
echo "Docs:           $(ls -1 *.md 2>/dev/null | wc -l | tr -d ' ')"
echo ""
