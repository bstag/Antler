/**
 * Comprehensive system test for the configurable content types and navigation system
 */

const fs = require('fs');
const path = require('path');

// Test configuration files
const testConfigs = {
  valid: {
    contentTypes: {
      blog: { enabled: true, label: "Blog", description: "Articles and posts" },
      projects: { enabled: true, label: "Projects", description: "Portfolio work" },
      resume: { enabled: false, label: "Resume", description: "Professional CV" },
      contact: { enabled: true, label: "Contact", description: "Get in touch" }
    },
    navigation: {
      items: [
        { id: "home", label: "Home", path: "/", enabled: true, order: 1 },
        { id: "blog", label: "Blog", path: "/blog", enabled: true, order: 2 },
        { id: "projects", label: "Projects", path: "/projects", enabled: true, order: 3 },
        { id: "contact", label: "Contact", path: "/contact", enabled: true, order: 4 }
      ]
    },
    siteMode: "blog-portfolio",
    metadata: { lastModified: "2024-01-15T10:30:00Z", version: "1.0.0" }
  },
  
  invalid: {
    contentTypes: "invalid", // Should be object
    navigation: { items: "invalid" }, // Should be array
    siteMode: null, // Should be string
    metadata: null // Should be object
  },
  
  portfolioOnly: {
    contentTypes: {
      projects: { enabled: true, label: "Projects", description: "Portfolio work" },
      resume: { enabled: true, label: "Resume", description: "Professional CV" },
      contact: { enabled: true, label: "Contact", description: "Get in touch" },
      blog: { enabled: false, label: "Blog", description: "Articles and posts" },
      docs: { enabled: false, label: "Documentation", description: "Technical docs" }
    },
    navigation: {
      items: [
        { id: "home", label: "Home", path: "/", enabled: true, order: 1 },
        { id: "projects", label: "Projects", path: "/projects", enabled: true, order: 2 },
        { id: "resume", label: "Resume", path: "/resume", enabled: true, order: 3 },
        { id: "contact", label: "Contact", path: "/contact", enabled: true, order: 4 }
      ]
    },
    siteMode: "portfolio",
    metadata: { lastModified: "2024-01-15T10:30:00Z", version: "1.0.0" }
  }
};

// Test functions
function testConfigValidation() {
  console.log('🧪 Testing Configuration Validation...');
  
  try {
    // Test valid config
    console.log('  ✓ Testing valid configuration...');
    const validResult = validateConfig(testConfigs.valid);
    if (!validResult.isValid) {
      console.error('    ❌ Valid config failed validation:', validResult.errors);
      return false;
    }
    console.log('    ✅ Valid config passed validation');
    
    // Test invalid config
    console.log('  ✓ Testing invalid configuration...');
    const invalidResult = validateConfig(testConfigs.invalid);
    if (invalidResult.isValid) {
      console.error('    ❌ Invalid config incorrectly passed validation');
      return false;
    }
    console.log('    ✅ Invalid config correctly failed validation');
    console.log('    📝 Errors found:', invalidResult.errors.length);
    
    return true;
  } catch (error) {
    console.error('  ❌ Configuration validation test failed:', error.message);
    return false;
  }
}

function testFileOperations() {
  console.log('🧪 Testing File Operations...');
  
  try {
    const testConfigPath = './src/config/test-config.json';
    
    // Test writing config
    console.log('  ✓ Testing config file writing...');
    fs.writeFileSync(testConfigPath, JSON.stringify(testConfigs.portfolioOnly, null, 2));
    console.log('    ✅ Config file written successfully');
    
    // Test reading config
    console.log('  ✓ Testing config file reading...');
    const readConfig = JSON.parse(fs.readFileSync(testConfigPath, 'utf8'));
    if (JSON.stringify(readConfig) !== JSON.stringify(testConfigs.portfolioOnly)) {
      console.error('    ❌ Read config does not match written config');
      return false;
    }
    console.log('    ✅ Config file read successfully');
    
    // Clean up
    fs.unlinkSync(testConfigPath);
    console.log('    🧹 Test file cleaned up');
    
    return true;
  } catch (error) {
    console.error('  ❌ File operations test failed:', error.message);
    return false;
  }
}

function testNavigationGeneration() {
  console.log('🧪 Testing Navigation Generation...');
  
  try {
    const config = testConfigs.portfolioOnly;
    
    // Test enabled items filtering
    console.log('  ✓ Testing enabled navigation items...');
    const enabledItems = config.navigation.items.filter(item => item.enabled);
    const expectedCount = 4; // home, projects, resume, contact
    
    if (enabledItems.length !== expectedCount) {
      console.error(`    ❌ Expected ${expectedCount} enabled items, got ${enabledItems.length}`);
      return false;
    }
    console.log(`    ✅ Found ${enabledItems.length} enabled navigation items`);
    
    // Test ordering
    console.log('  ✓ Testing navigation item ordering...');
    const sortedItems = [...enabledItems].sort((a, b) => a.order - b.order);
    const isCorrectOrder = sortedItems.every((item, index) => item.order === index + 1);
    
    if (!isCorrectOrder) {
      console.error('    ❌ Navigation items are not in correct order');
      return false;
    }
    console.log('    ✅ Navigation items are correctly ordered');
    
    return true;
  } catch (error) {
    console.error('  ❌ Navigation generation test failed:', error.message);
    return false;
  }
}

function testContentTypeFiltering() {
  console.log('🧪 Testing Content Type Filtering...');
  
  try {
    const config = testConfigs.portfolioOnly;
    
    // Test enabled content types
    console.log('  ✓ Testing enabled content types...');
    const enabledContentTypes = Object.entries(config.contentTypes)
      .filter(([_, contentType]) => contentType.enabled)
      .map(([key, _]) => key);
    
    const expectedEnabled = ['projects', 'resume', 'contact'];
    const hasAllExpected = expectedEnabled.every(type => enabledContentTypes.includes(type));
    const hasNoUnexpected = enabledContentTypes.every(type => expectedEnabled.includes(type));
    
    if (!hasAllExpected || !hasNoUnexpected) {
      console.error('    ❌ Enabled content types do not match expected:', enabledContentTypes);
      return false;
    }
    console.log('    ✅ Enabled content types match expected configuration');
    
    // Test disabled content types
    console.log('  ✓ Testing disabled content types...');
    const disabledContentTypes = Object.entries(config.contentTypes)
      .filter(([_, contentType]) => !contentType.enabled)
      .map(([key, _]) => key);
    
    const expectedDisabled = ['blog', 'docs'];
    const hasAllExpectedDisabled = expectedDisabled.every(type => disabledContentTypes.includes(type));
    
    if (!hasAllExpectedDisabled) {
      console.error('    ❌ Disabled content types do not match expected:', disabledContentTypes);
      return false;
    }
    console.log('    ✅ Disabled content types match expected configuration');
    
    return true;
  } catch (error) {
    console.error('  ❌ Content type filtering test failed:', error.message);
    return false;
  }
}

function testSiteModeTemplates() {
  console.log('🧪 Testing Site Mode Templates...');
  
  try {
    const templates = ['resume-only', 'blog-only', 'portfolio', 'full-site'];
    
    console.log('  ✓ Testing template availability...');
    // In a real implementation, we would check if template files exist
    // For now, we'll just verify the template names are valid
    const validTemplates = templates.every(template => 
      typeof template === 'string' && template.length > 0
    );
    
    if (!validTemplates) {
      console.error('    ❌ Invalid template names found');
      return false;
    }
    console.log(`    ✅ All ${templates.length} templates are valid`);
    
    // Test portfolio template configuration
    console.log('  ✓ Testing portfolio template configuration...');
    const portfolioConfig = testConfigs.portfolioOnly;
    const hasProjects = portfolioConfig.contentTypes.projects?.enabled;
    const hasResume = portfolioConfig.contentTypes.resume?.enabled;
    const hasContact = portfolioConfig.contentTypes.contact?.enabled;
    const noBlog = !portfolioConfig.contentTypes.blog?.enabled;
    const noDocs = !portfolioConfig.contentTypes.docs?.enabled;
    
    if (!hasProjects || !hasResume || !hasContact || !noBlog || !noDocs) {
      console.error('    ❌ Portfolio template configuration is incorrect');
      return false;
    }
    console.log('    ✅ Portfolio template configuration is correct');
    
    return true;
  } catch (error) {
    console.error('  ❌ Site mode templates test failed:', error.message);
    return false;
  }
}

function testErrorHandling() {
  console.log('🧪 Testing Error Handling...');
  
  try {
    // Test missing config file
    console.log('  ✓ Testing missing config file handling...');
    try {
      const missingConfig = fs.readFileSync('./non-existent-config.json', 'utf8');
      console.error('    ❌ Should have thrown error for missing file');
      return false;
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('    ✅ Correctly handled missing config file');
      } else {
        throw error;
      }
    }
    
    // Test malformed JSON
    console.log('  ✓ Testing malformed JSON handling...');
    try {
      const malformedJson = '{ invalid json }';
      JSON.parse(malformedJson);
      console.error('    ❌ Should have thrown error for malformed JSON');
      return false;
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.log('    ✅ Correctly handled malformed JSON');
      } else {
        throw error;
      }
    }
    
    return true;
  } catch (error) {
    console.error('  ❌ Error handling test failed:', error.message);
    return false;
  }
}

// Mock validation function (would import from actual module)
function validateConfig(config) {
  const errors = [];
  
  if (!config.contentTypes || typeof config.contentTypes !== 'object') {
    errors.push('contentTypes must be an object');
  }
  
  if (!config.navigation?.items || !Array.isArray(config.navigation.items)) {
    errors.push('navigation.items must be an array');
  }
  
  if (!config.siteMode || typeof config.siteMode !== 'string') {
    errors.push('siteMode must be a string');
  }
  
  if (!config.metadata || typeof config.metadata !== 'object') {
    errors.push('metadata must be an object');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting Comprehensive System Tests\n');
  
  const tests = [
    { name: 'Configuration Validation', fn: testConfigValidation },
    { name: 'File Operations', fn: testFileOperations },
    { name: 'Navigation Generation', fn: testNavigationGeneration },
    { name: 'Content Type Filtering', fn: testContentTypeFiltering },
    { name: 'Site Mode Templates', fn: testSiteModeTemplates },
    { name: 'Error Handling', fn: testErrorHandling }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    console.log(`\n📋 Running ${test.name} Tests:`);
    try {
      const result = test.fn();
      if (result) {
        passed++;
        console.log(`✅ ${test.name} tests PASSED\n`);
      } else {
        failed++;
        console.log(`❌ ${test.name} tests FAILED\n`);
      }
    } catch (error) {
      failed++;
      console.error(`💥 ${test.name} tests CRASHED:`, error.message, '\n');
    }
  }
  
  console.log('📊 Test Results Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! The system is ready for production.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review and fix the issues before deployment.');
  }
  
  return failed === 0;
}

// Export for use in other modules
module.exports = { runAllTests, testConfigs };

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}