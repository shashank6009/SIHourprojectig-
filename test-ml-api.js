// Simple test script to verify ML API integration
const axios = require('axios');

async function testMLAPI() {
  const testPayload = {
    student_id: "test_user_123",
    skills: ["Python", "JavaScript", "React", "Node.js", "Communication", "Problem Solving"],
    stream: "Computer Science",
    cgpa: 8.5,
    rural_urban: "Urban",
    college_tier: "Tier-2"
  };

  console.log('Testing ML API with payload:');
  console.log(JSON.stringify(testPayload, null, 2));
  console.log('\n--- Making API Request ---');

  try {
    const response = await axios.post('https://web-production-c72b1.up.railway.app/recommendations', testPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000
    });

    console.log('✅ API Success!');
    console.log('Status:', response.status);
    console.log('Response:');
    console.log(JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.log('❌ API Error:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response Data:');
      console.log(JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('No response received');
      console.log('Request:', error.request);
    } else {
      console.log('Error setting up request:', error.message);
    }
  }
}

// Run the test
testMLAPI();
