const axios = require('axios');

// Debug the ML model response
async function debugModelResponse() {
  try {
    const apiClient = axios.create({
      baseURL: 'https://web-production-c72b1.up.railway.app',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Test with a simpler payload first
    const simplePayload = {
      student_id: "debug_test",
      skills: ["Python"],
      stream: "Computer Science",
      cgpa: 8.0,
      rural_urban: "Urban",
      college_tier: "Tier-1"
    };

    console.log('=== DEBUGGING ML MODEL ===');
    console.log('Simple Payload:', JSON.stringify(simplePayload, null, 2));

    const response = await apiClient.post('/recommendations', simplePayload);
    
    console.log('\n=== FULL RESPONSE ===');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));

    // Test health endpoint
    console.log('\n=== TESTING HEALTH ENDPOINT ===');
    try {
      const healthResponse = await apiClient.get('/health');
      console.log('Health Status:', healthResponse.status);
      console.log('Health Response:', JSON.stringify(healthResponse.data, null, 2));
    } catch (healthError) {
      console.log('Health endpoint error:', healthError.message);
    }

    // Test with different payload variations
    console.log('\n=== TESTING DIFFERENT PAYLOADS ===');
    
    const payloads = [
      {
        student_id: "test1",
        skills: ["Python", "Java"],
        stream: "Computer Science",
        cgpa: 8.5,
        rural_urban: "Urban",
        college_tier: "Tier-1"
      },
      {
        student_id: "test2",
        skills: ["Python"],
        stream: "Engineering",
        cgpa: 7.5,
        rural_urban: "Rural",
        college_tier: "Tier-2"
      },
      {
        student_id: "test3",
        skills: ["Communication", "Leadership"],
        stream: "Business",
        cgpa: 8.0,
        rural_urban: "Urban",
        college_tier: "Tier-1"
      }
    ];

    for (let i = 0; i < payloads.length; i++) {
      console.log(`\n--- Testing Payload ${i + 1} ---`);
      try {
        const testResponse = await apiClient.post('/recommendations', payloads[i]);
        console.log(`Recommendations count: ${testResponse.data.recommendations?.length || 0}`);
        if (testResponse.data.recommendations?.length > 0) {
          console.log('First recommendation:', testResponse.data.recommendations[0].title);
        }
      } catch (error) {
        console.log('Error:', error.message);
      }
    }

  } catch (error) {
    console.error('Error debugging model:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

debugModelResponse();
