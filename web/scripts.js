// script.js

function handleSearch() {
    const searchInput = document.getElementById('searchInput').value;
  
    // Check if the input is not empty
    if (!searchInput.trim()) {
      alert("Please enter a search term.");
      return;
    }
  
    // Create the request payload
    const data = { query: searchInput };
  
    // Send a POST request
    fetch('http://localhost:3000/api/search', { // Replace with your API endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Handle the response data
      displayResults(data);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  }

function handleSearch2() {
  // Simulated data as provided
  const simulatedData = [{'_id': 'SIMONFRASERUNIVERSITY', 'org_name': 'SIMONFRASERUNIVERSITY', 'description': {'Description': "Simon Fraser University (SFU) is a public research university located in British Columbia, Canada. Founded in 1965, it is named after the 19th-century explorer Simon Fraser, whose explorations contributed to the knowledge of the region. Here is an overview of SFU:### Campuses:\nSFU has three campuses:\n1. **Burnaby Campus** - The main campus, located on Burnaby Mountain, is known for its stunning views, innovative architecture, and extensive student facilities.\n2. **Vancouver Campus** - Situated in the heart of downtown Vancouver, this campus hosts various programs, particularly in the arts, business, and urban studies.\n3. **Surrey Campus** - This campus focuses on undergraduate education and is known for its emphasis on technology and liberal arts programs.\n\n### Academics:\n1. **Programs**: SFU offers a wide range of undergraduate and graduate programs across various faculties and interdisciplinary studies. Some key faculties include:\n   - Faculty of Arts and Social Sciences\n   - Beedie School of Business\n   - Faculty of Science\n   - Faculty of Communication, Art and Technology\n   - Faculty of Education\n   - Faculty of Health Sciences\n   - Faculty of Environment\n   - Faculty of Applied Sciences\n\n2. **Research**: SFU is recognized for its strong research outputs and innovative projects. It is considered one of Canada's leading research universities, with robust funding and numerous interdisciplinary research initiatives.\n\n### Student Life:\n1. **Diversity**: SFU has a diverse student population, with thousands of international students from various countries.\n2. **Clubs and Societies**: The university boasts a rich student life, with various clubs, organizations, and events to foster community engagement.\n3. **Athletics**: SFU is part of NCAA Division II and competes in a variety of sports. The university has a spirited athletics program that encourages student participation.\n\n### Community Engagement:\nSFU emphasizes community engagement and sustainability, encouraging students to participate in projects and initiatives that benefit the surrounding communities.\n\n### Global Reach:\nSFU has established partnerships with institutions around the world, promoting international collaboration in research and student exchanges.\n\n### Rankings:\nSFU is consistently ranked among the top universities in Canada and has earned a reputation for its innovative approach to education and research.\n\nIn summary, Simon Fraser University is a vibrant institution that combines academic excellence with a commitment to research, community engagement, and student life, making it a prominent choice for students both domestically and internationally."}, 'insight': {'Insight': "The provided information gives a comprehensive overview of the academic structure and programs offered at Simon Fraser University (SFU). Here¡¯s a summarized version focusing on key elements for easy reference.\n\n### Simon Fraser University (SFU) Overview\n\n**1. Faculty of Arts and Social Sciences (FASS)**\n   - **Departments:**\n     - Anthropology\n     - Economics\n     - English\n     - History\n     - Linguistics\n     - Philosophy\n     - Political Science\n     - Sociology and Anthropology\n     - Gender, Sexuality, and Women's Studies\n   - **Focus**: Interdisciplinary approaches to humanistic and social issues.\n\n**2. Faculty of Business Administration**\n   - **Departments:**\n     - Accounting\n     - Business Administration\n     - Finance\n     - Marketing\n     - Operations Management\n   - **Focus**: Experiential learning and research in a global business environment.\n\n**3. Faculty of Communication, Art and Technology (CART)**\n   - **Departments:**\n     - Communication\n     - Interactive Arts and Technology\n     - Art\n   - **Focus**: Integration of technology and creative skills in media and arts careers.\n\n**4. Faculty of Education**\n   - **Departments:**\n     - Teaching and Learning\n     - Educational Psychology\n     - Curriculum and Instruction\n     - Indigenous Education\n   - **Focus**: Innovating teaching practices through research.\n\n**5. Faculty of Health Sciences**\n   - **Department:**\n     - Health Sciences\n   - **Focus**: Interdisciplinary education in health and community well-being.\n\n**6. Faculty of Science**\n   - **Departments:**\n     - Biological Sciences\n     - Chemistry\n     - Mathematics\n     - Physics\n     - Statistics and Actuarial Science\n     - Earth Sciences\n   - **Focus**: Research and education across diverse scientific fields.\n\n**7. Faculty of Applied Sciences**\n   - **Departments:**\n     - Computer Science\n     - Engineering Science\n     - Mechatronics Systems Engineering\n     - Sustainable Energy Engineering\n   - **Focus**: Applying science to real-world problems.\n\n**8. School of Public Policy**\n   - **Focus**: Education and research preparing students for public policy roles.\n\n**9. School of Interactive Arts and Technology (SIAT)**\n   - **Focus**: Education in design, technology, and media with research opportunities.\n\n**10. Graduate Programs**\n   - **Focus**: Interdisciplinary programs for advanced fields of study.\n\n### Additional Aspects\n- **Research and Community Engagement**: SFU prioritizes research initiatives and community involvement.\n- **Campuses**: Located in Burnaby, Vancouver, and Surrey for diverse learning environments.\n\n### Conclusion\nSFU offers a rich academic structure, ideal for students interested in various fields. Potential students are encouraged to explore further through the official SFU website for more specific information and opportunities."}, 'account': [
    {
        "website": "Filmot Channel Search",
        "url": "https://filmot.com/channelsearch/Simon_Fraser_University"
    },
    {
        "website": "Filmot Unlisted Videos",
        "url": "https://filmot.com/unlistedSearch?channelQuery=Simon_Fraser_University&sortField=uploaddate&sortOrder=desc&"
    },
    {
        "website": "Internet Archive User Search",
        "url": "https://archive.org/search.php?query=Simon_Fraser_University"
    },
    {
        "website": "Telegram",
        "url": "https://t.me/Simon_Fraser_University"
    },
    {
        "website": "TikTok",
        "url": "https://www.tiktok.com/@Simon_Fraser_University?lang=en"
    },
    {
        "website": "YouTube Channel",
        "url": "https://www.youtube.com/c/Simon_Fraser_University/about"
    },
    {
        "website": "Blogspot",
        "url": "http://SimonFraserUniversity.blogspot.com"
    },
    {
        "website": "Chess.com",
        "url": "https://www.chess.com/member/SimonFraserUniversity"
    },
    {
        "website": "giters",
        "url": "https://giters.com/SimonFraserUniversity"
    },
    {
        "website": "Gravatar",
        "url": "https://en.gravatar.com/SimonFraserUniversity"
    },
    {
        "website": "Internet Archive User Search",
        "url": "https://archive.org/search.php?query=SimonFraserUniversity"
    },
    {
        "website": "issuu",
        "url": "https://issuu.com/SimonFraserUniversity"
    },
    {
        "website": "Telegram",
        "url": "https://t.me/SimonFraserUniversity"
    },
    {
        "website": "TikTok",
        "url": "https://www.tiktok.com/@SimonFraserUniversity?lang=en"
    },
    {
        "website": "tumblr",
        "url": "https://SimonFraserUniversity.tumblr.com"
    },
    {
        "website": "Twitch",
        "url": "https://twitch.tv/SimonFraserUniversity/"
    },
    {
        "website": "YouTube Channel",
        "url": "https://www.youtube.com/c/SimonFraserUniversity/about"
    },
    {
        "website": "YouTube User2",
        "url": "https://www.youtube.com/@SimonFraserUniversity"
    }
], 'email': [{"email": "barbara_hilden@sfu.ca", "full_name": "Barbara Hilden"}, {"email": "gustavo_balbinot@sfu.ca", "full_name": "Gustavo Balbinot"}, {"email": "marilyn_e_trautman@sfu.ca", "full_name": "Marilyn Trautman"}, {"email": "shivani_kundra@sfu.ca", "full_name": "Shivani Kundra"}, {"email": "damon_van_der_linde@sfu.ca", "full_name": "Damon Linde"}, {"email": "sarah_mckay@sfu.ca", "full_name": "Sarah McKay"}, {"email": "kieran_cox@sfu.ca", "full_name": "Kieran Cox"}, {"email": "amr_marzouk@sfu.ca", "full_name": "Amr Marzouk"}, {"email": "alexis_carr@sfu.ca", "full_name": "Alexis Carr"}, {"email": "mkhan@sfu.ca", "full_name": "Madiha Khan"}], 'github': [{"URL": "https://github.com/medooze/sfu", "Description": "A future proof, experimental WebRTC VP9 SVC SFU wit end to end encryption support"}, {"URL": "https://github.com/inlivedev/sfu", "Description": "WebRTC Selective Forwarder Unit(SFU) Golang Library"}, {"URL": "https://github.com/webrtc-rs/sfu", "Description": "WebRTC Selective Forwarding Unit (SFU) in Rust with Sans-IO"}, {"URL": "https://github.com/medooze/sfu", "Description": "A future proof, experimental WebRTC VP9 SVC SFU wit end to end encryption support"}, {"URL": "https://github.com/inlivedev/sfu", "Description": "WebRTC Selective Forwarder Unit(SFU) Golang Library"}, {"URL": "https://github.com/webrtc-rs/sfu", "Description": "WebRTC Selective Forwarding Unit (SFU) in Rust with Sans-IO"}], 'censys': [{"operating_system": {"other": [{"key": "family", "value": "FortiOS"}, {"key": "device", "value": "Firewall"}], "source": "OSI_APPLICATION_LAYER", "part": "o", "product": "FortiOS", "vendor": "Fortinet", "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"}, "last_updated_at": "2024-11-13T11:31:40.617Z", "autonomous_system": {"description": "SFU-AS", "bgp_prefix": "142.58.0.0/16", "asn": 11105, "country_code": "CA", "name": "SFU-AS"}, "ip": "142.58.74.50", "dns": {"reverse_dns": {"names": ["vpr-db34.dc.sfu.ca"]}}, "location": {"postal_code": "V5A", "province": "British Columbia", "timezone": "America/Vancouver", "country": "Canada", "continent": "North America", "coordinates": {"latitude": 49.26636, "longitude": -122.95263}, "country_code": "CA", "city": "Burnaby"}, "services": [{"transport_protocol": "TCP", "service_name": "HTTP", "extended_service_name": "HTTP", "port": 80}, {"service_name": "HTTP", "transport_protocol": "TCP", "certificate": "cece452211a601a6fde0d3b21c81a4d4a6edb44b8c7a00e64a097f7ea71b1151", "extended_service_name": "HTTPS", "port": 443}, {"service_name": "HTTP", "transport_protocol": "TCP", "certificate": "db9b3b3b31518ba7bad1c0270c69e59eea91f51d4acf844257985bce52cb6945", "extended_service_name": "HTTPS", "port": 8010}, {"service_name": "HTTP", "transport_protocol": "TCP", "certificate": "c549479d4ef73a10bac17a3741563f82f125d9069d3e22f9920e9140db9a8bb7", "extended_service_name": "HTTPS", "port": 8015}, {"transport_protocol": "TCP", "extended_service_name": "HTTP", "service_name": "HTTP", "port": 8020}]}, {"operating_system": {"other": [{"key": "family", "value": "FortiOS"}, {"key": "device", "value": "Firewall"}], "source": "OSI_APPLICATION_LAYER", "part": "o", "product": "FortiOS", "vendor": "Fortinet", "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"}, "last_updated_at": "2024-11-13T17:18:46.891Z", "autonomous_system": {"description": "SFU-AS", "bgp_prefix": "142.58.0.0/16", "asn": 11105, "country_code": "CA", "name": "SFU-AS"}, "ip": "142.58.142.13", "dns": {"reverse_dns": {"names": ["adv.science.sfu.ca"]}}, "location": {"postal_code": "V5A", "province": "British Columbia", "timezone": "America/Vancouver", "country": "Canada", "continent": "North America", "coordinates": {"latitude": 49.26636, "longitude": -122.95263}, "country_code": "CA", "city": "Burnaby"}, "services": [{"transport_protocol": "TCP", "service_name": "HTTP", "extended_service_name": "HTTP", "port": 80}, {"extended_service_name": "HTTPS", "transport_protocol": "TCP", "service_name": "HTTP", "certificate": "e903e62a11d8ff9f975848a286e3fe064bd16407bf5e8cfafd3916cd0e209f2c", "port": 443}, {"service_name": "HTTP", "transport_protocol": "TCP", "certificate": "c215387d152c19fac7fa0d3132b64964c251daa8a9037c5817beaae118985393", "extended_service_name": "HTTPS", "port": 8010}, {"extended_service_name": "HTTPS", "transport_protocol": "TCP", "service_name": "HTTP", "certificate": "5a40019f05965c59f1ecc70f5ead82caef42217474dc27d80e6f387acf337af7", "port": 8015}, {"transport_protocol": "TCP", "extended_service_name": "HTTP", "service_name": "HTTP", "port": 8020}]}], 'email_breaches': [    {
        "Email": "jpei@cs.sfu.ca",
        "Breaches": [
            {"Name": "LinkedIn", "BreachDate": "2012-05-05"},
            {"Name": "Dropbox", "BreachDate": "2012-07-01"},
            {"Name": "MDPI", "BreachDate": "2016-08-30"},
            {"Name": "TrikSpamBotnet", "BreachDate": "2018-06-12"},
            {"Name": "Collection1", "BreachDate": "2019-01-07"},
            {"Name": "VerificationsIO", "BreachDate": "2019-02-25"},
            {"Name": "PDL", "BreachDate": "2019-10-16"},
            {"Name": "LinkedInScrape", "BreachDate": "2021-04-08"},
            {"Name": "MGM2022Update", "BreachDate": "2019-07-25"},
            {"Name": "Locally", "BreachDate": "2022-10-01"},
            {"Name": "TelegramCombolists", "BreachDate": "2024-05-28"},
            {"Name": "FairVoteCanada", "BreachDate": "2024-03-02"}
        ]
    },
    {
        "Email": "veronica@cs.sfu.ca",
        "Breaches": [
            {"Name": "Adobe", "BreachDate": "2013-10-04"},
            {"Name": "MoneyBookers", "BreachDate": "2009-01-01"},
            {"Name": "LinkedIn", "BreachDate": "2012-05-05"},
            {"Name": "B2BUSABusinesses", "BreachDate": "2017-07-18"},
            {"Name": "VerificationsIO", "BreachDate": "2019-02-25"},
            {"Name": "Evite", "BreachDate": "2013-08-11"},
            {"Name": "PDL", "BreachDate": "2019-10-16"},
            {"Name": "LinkedInScrape", "BreachDate": "2021-04-08"},
            {"Name": "Gravatar", "BreachDate": "2020-10-03"},
            {"Name": "FairVoteCanada", "BreachDate": "2024-03-02"}
        ]
    },
    {
        "Email": "stella@cs.sfu.ca",
        "Breaches": [
            {"Name": "VerificationsIO", "BreachDate": "2019-02-25"}
        ]
    },
    {
        "Email": "funda@cs.sfu.ca",
        "Breaches": [
            {"Name": "LinkedIn", "BreachDate": "2012-05-05"},
            {"Name": "VerificationsIO", "BreachDate": "2019-02-25"},
            {"Name": "Evite", "BreachDate": "2013-08-11"},
            {"Name": "PDL", "BreachDate": "2019-10-16"},
            {"Name": "LinkedInScrape", "BreachDate": "2021-04-08"}
        ]
    },
    {
        "Email": "kamal@cs.sfu.ca",
        "Breaches": [
            {"Name": "Stratfor", "BreachDate": "2011-12-24"},
            {"Name": "LinkedIn", "BreachDate": "2012-05-05"},
            {"Name": "Dropbox", "BreachDate": "2012-07-01"},
            {"Name": "Adapt", "BreachDate": "2018-11-05"},
            {"Name": "VerificationsIO", "BreachDate": "2019-02-25"},
            {"Name": "PDL", "BreachDate": "2019-10-16"},
            {"Name": "LinkedInScrape", "BreachDate": "2021-04-08"}
        ]
    },
    {
        "Email": "jcliu@cs.sfu.ca",
        "Breaches": [
            {"Name": "LinkedIn", "BreachDate": "2012-05-05"},
            {"Name": "Dropbox", "BreachDate": "2012-07-01"},
            {"Name": "AntiPublic", "BreachDate": "2016-12-16"},
            {"Name": "ExploitIn", "BreachDate": "2016-10-13"},
            {"Name": "MDPI", "BreachDate": "2016-08-30"},
            {"Name": "Collection1", "BreachDate": "2019-01-07"},
            {"Name": "VerificationsIO", "BreachDate": "2019-02-25"},
            {"Name": "PDL", "BreachDate": "2019-10-16"},
            {"Name": "Cit0day", "BreachDate": "2020-11-04"},
            {"Name": "LinkedInScrape", "BreachDate": "2021-04-08"},
            {"Name": "TelegramCombolists", "BreachDate": "2024-05-28"}
        ]
    },
    {
        "Email": "ljilja@cs.sfu.ca",
        "Breaches": [
            {"Name": "LinkedIn", "BreachDate": "2012-05-05"},
            {"Name": "AntiPublic", "BreachDate": "2016-12-16"},
            {"Name": "OnlinerSpambot", "BreachDate": "2017-08-28"},
            {"Name": "Rankwatch", "BreachDate": "2016-11-19"},
            {"Name": "TrikSpamBotnet", "BreachDate": "2018-06-12"},
            {"Name": "Apollo", "BreachDate": "2018-07-23"},
            {"Name": "VerificationsIO", "BreachDate": "2019-02-25"},
            {"Name": "Netlog", "BreachDate": "2012-11-01"},
            {"Name": "PDL", "BreachDate": "2019-10-16"},
            {"Name": "Gravatar", "BreachDate": "2020-10-03"},
            {"Name": "Twitter200M", "BreachDate": "2021-01-01"},
            {"Name": "NazApi", "BreachDate": "2023-09-20"},
            {"Name": "TelegramCombolists", "BreachDate": "2024-05-28"}
        ]
    },
    {
        "Email": "angiez@cs.sfu.ca",
        "Breaches": [
            {"Name": "PDL", "BreachDate": "2019-10-16"}
        ]
    },
    {
        "Email": "tayebi@cs.sfu.ca",
        "Breaches": [
            {"Name": "VerificationsIO", "BreachDate": "2019-02-25"}
        ]
    },
    {
        "Email": "mehta@cs.sfu.ca",
        "Breaches": [
            {"Name": "OnlinerSpambot", "BreachDate": "2017-08-28"}
        ]
    },
    {
        "Email": "amr_marzouk@sfu.ca",
        "Breaches": [
            {"Name": "VerificationsIO", "BreachDate": "2019-02-25"},
            {"Name": "DemandScience", "BreachDate": "2024-02-28"}
        ]
    },
    {
        "Email": "mkhan@sfu.ca",
        "Breaches": [
            {"Name": "Dropbox", "BreachDate": "2012-07-01"},
            {"Name": "VerificationsIO", "BreachDate": "2019-02-25"},
            {"Name": "Nitro", "BreachDate": "2020-09-28"},
            {"Name": "Luxottica", "BreachDate": "2021-03-16"}
        ]
    }], 'ip': [
      {
          "ip": "142.58.142.231"
      },
      {
          "ip": "3.97.108.247"
      },
      {
          "ip": "142.58.142.134"
      },
      {
          "ip": "142.58.103.55"
      },
      {
          "ip": "34.211.108.47"
      },
      {
          "ip": "142.58.143.66"
      },
      {
          "ip": "142.58.143.9"
      }
  ]}];

  // Directly call displayResults with simulated data
  displayResults(simulatedData);
}
  
function displayResults(results) {
  console.log(results[0].description)
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = ''; // Clear previous results

  results.forEach(result => {
    const resultContainer = document.createElement('div');
    resultContainer.className = 'result-container';
    resultContainer.innerHTML = `
      <h2 class="org-title">Organization: ${result.org_name || 'Organization'}</h2>
      <div class="field-box">

        <div class="field-title" onclick="toggleField(this)">
          <span class="arrow">&#9660;</span> Account
        </div>
        <div class="field-content" style="display: none;">${formatAccountDataAsTable(result.account)}</div>
      </div>
      <div class="field-box">
        <div class="field-title" onclick="toggleField(this)">
          <span class="arrow">&#9660;</span> Censys
        </div>
        <div class="field-content" style="display: none;">${displayDataList(result.censys)}</div>
      </div>
      <div class="field-box">
        <div class="field-title" onclick="toggleField(this)">
          <span class="arrow">&#9660;</span> Description
        </div>
        <div class="field-content" style="display: none;">${displayFormattedOverview(result.description.Description)}</div>
      </div>
      <div class="field-box">
        <div class="field-title" onclick="toggleField(this)">
          <span class="arrow">&#9660;</span> Email
        </div>
        <div class="field-content" style="display: none;">${formatEmailDataAsTable(result.email)}</div>
      </div>
      <div class="field-box">
        <div class="field-title" onclick="toggleField(this)">
          <span class="arrow">&#9660;</span> Email Breaches
        </div>
        <div class="field-content" style="display: none;">${formatBreachDataAsTable(result.email_breaches)}</div>
      </div>
      <div class="field-box">
        <div class="field-title" onclick="toggleField(this)">
          <span class="arrow">&#9660;</span> GitHub
        </div>
        <div class="field-content" style="display: none;">${formatGithubDataAsTable(result.github)}</div>
      </div>
      <div class="field-box">
        <div class="field-title" onclick="toggleField(this)">
          <span class="arrow">&#9660;</span> Insight
        </div>
        <div class="field-content" style="display: none;">${displayFormattedOverview(result.insight.Insight)}</div>
      </div>
      <div class="field-box">
        <div class="field-title" onclick="toggleField(this)">
          <span class="arrow">&#9660;</span> IP Safe List
        </div>
        <div class="field-content" style="display: none;">${formatIpDataAsTable(result.ip)}</div>
      </div>
    `;
    resultsContainer.appendChild(resultContainer);
  });
}

// 只控制显示或隐藏字段内容
function toggleField(element) {
  const content = element.nextElementSibling;
  const arrow = element.querySelector(".arrow");
  
  // 切换显示状态
  if (content.style.display === "none") {
    content.style.display = "block";
    arrow.innerHTML = "&#9650;"; // 上箭头
  } else {
    content.style.display = "none";
    arrow.innerHTML = "&#9660;"; // 下箭头
  }
}

function displayDataList(dataList) {
  return `
      <table class="data-table">
          <thead>
              <tr>
                  <th>Entry</th>
                  <th>Operating System</th>
                  <th>Network Address</th>
                  <th>Autonomous System</th>
                  <th>Location</th>
                  <th>Services</th>
              </tr>
          </thead>
          <tbody>
              ${dataList.map((data, index) => `
                  <tr>
                      <td>${index + 1}</td>

                      <td>
                        <strong>Product:</strong> ${data.operating_system.product}<br>
                        <strong>Vendor:</strong> ${data.operating_system.vendor}<br>
                        <strong>Source:</strong> ${data.operating_system.source}<br>
                        <strong>Cpe:</strong> ${data.operating_system.cpe}<br>
                      </td>
                      </td>
                      <td>
                        <strong>IP Address:</strong> ${data.ip}<br>
                        <strong>DNS:</strong> ${data.dns.reverse_dns.names}<br>
                      </td>
                      <td>
                        <strong>Name:</strong> ${data.autonomous_system.name}<br>
                        <strong>Bgp prefix:</strong> ${data.autonomous_system.bgp_prefix}<br>
                        <strong>Asn:</strong> ${data.autonomous_system.asn}<br>
                      </td>
                      <td><strong>City:</strong> ${data.location.city}<br>
                        <strong>Province:</strong> ${data.location.province}<br>
                        <strong>Country:</strong> ${data.location.country}<br>
                        <strong>Country Code:</strong> ${data.location.country_code}<br>
                        <strong>Continent:</strong> ${data.location.continent}<br>
                        <strong>Postal Code:</strong> ${data.location.postal_code}<br>
                        <strong>Coordinates</strong><br> 
                        latitude: ${data.location.coordinates.latitude}<br>
                        longitude: ${data.location.coordinates.longitude}
                      </td>
                      <td>
                          <ul class="custom-list-style-1">
                              ${data.services.map(service => `
                                  <li>
                                      <strong>${service.service_name}</strong>
                                      (${service.transport_protocol} on port ${service.port})
                                      ${service.certificate ? `<br>Certificate: ${service.certificate}` : ''}
                                  </li>
                              `).join('')}
                          </ul>
                      </td>
                  </tr>
              `).join('')}
          </tbody>
      </table>
  `;
}

function formatDataAsTable(data) {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.error("Data format error:", e);
      return "Invalid data format";
    }
  }

  if (!Array.isArray(data)) return "No valid data available";

  // 构建表格
  let tableHTML = "<table class='data-table'><thead><tr><th>Generated</th><th>Type</th><th>Data</th><th>Module</th><th>Source</th></tr></thead><tbody>";

  data.forEach(item => {
    tableHTML += `
      <tr>
        <td>${item.generated || '-'}</td>
        <td>${item.type || '-'}</td>
        <td>${item.data || '-'}</td>
        <td>${item.module || '-'}</td>
        <td>${item.source || '-'}</td>
      </tr>
    `;
  });

  tableHTML += "</tbody></table>";
  return tableHTML;
}

function formatIpDataAsTable(data) {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.error("Data format error:", e);
      return "Invalid data format";
    }
  }

  if (!Array.isArray(data)) return "No valid data available";

  // 构建表格
  let tableHTML = "<table class='data-table'><thead><tr><th>Ip Safe List</th></tr></thead><tbody>";

  data.forEach(item => {
    tableHTML += `
      <tr>
        <td>${item.ip || '-'}</td>
      </tr>
    `;
  });

  tableHTML += "</tbody></table>";
  return tableHTML;
}

function formatBreachDataAsTable(data) {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.error("Data format error:", e);
      return "Invalid data format";
    }
  }

  if (!Array.isArray(data)) return "No valid data available";

  // 构建表格
  let tableHTML = "<table class='data-table'><thead><tr><th>Email</th><th>Breaches</th></tr></thead><tbody>";

  data.forEach(item => {
    tableHTML += `
      <tr>
        <td>${item.Email || '-'}</td>
        <td>
          <ul class="custom-list-style-1">
              ${item.Breaches.map(breach => `
                  <li>
                      <strong>Email: </strong>${breach.Name}<br>
                      <strong>BreachDate: </strong>${breach.BreachDate}<br>
                  </li>
              `).join('')}
          </ul>
        </td>
      </tr>
    `;
  });

  tableHTML += "</tbody></table>";
  return tableHTML;
}

function formatAccountDataAsTable(data) {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.error("Data format error:", e);
      return "Invalid data format";
    }
  }

  if (!Array.isArray(data)) return "No valid data available";

  // 构建表格
  let tableHTML = "<table class='data-table'><thead><tr><th>Website</th><th>Url</th></tr></thead><tbody>";

  data.forEach(item => {
    tableHTML += `
      <tr>
        <td>${item.website || '-'}</td>
        <td>${item.url || '-'}</td>
      </tr>
    `;
  });

  tableHTML += "</tbody></table>";
  return tableHTML;
}

function formatGithubDataAsTable(data) {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.error("Data format error:", e);
      return "Invalid data format";
    }
  }

  if (!Array.isArray(data)) return "No valid data available";

  // 构建表格
  let tableHTML = "<table class='data-table'><thead><tr><th>Url</th><th>Description</th></tr></thead><tbody>";

  data.forEach(item => {
    tableHTML += `
      <tr>
        <td>${item.URL || '-'}</td>
        <td>${item.Description || '-'}</td>
      </tr>
    `;
  });

  tableHTML += "</tbody></table>";
  return tableHTML;
}

function displayFormattedOverview(text) {
  // Replace headings (###) with <h3> tags
  let formattedText = text
      .replace(/###\s(.+):/g, '<h3>$1</h3>') // Convert headings (### to <h3>)
      // Replace ### with <h3> for larger headers
      .replace(/^### (.*)$/gm, '<h3>$1</h3>')
      .replace(/\n{2,}/g, '<br>'); // Preserve paragraphs

  // Replace **bold text** with <strong> tags
  formattedText = formattedText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Replace list items with HTML <ul> and <li> tags
  formattedText = formattedText
      .replace(/\d+\.\s/g, '<ul><li>') // Numbered list items start with <ul><li>
      .replace(/-\s/g, '<ul><li>'); // Bullet list items start with <ul><li>

  // Ensure every list item is properly closed
  formattedText = formattedText.replace(/<\/li>(?!<\/ul>)/g, '</li></ul>'); // Close <ul> tag after each list

  // Remove any extra <ul><li> at the start (for cases where the list starts immediately with a list item)
  formattedText = formattedText.replace(/^<ul><li>/g, '').replace(/<\/ul><li>/g, '</li>');

  return formattedText; // Return the formatted HTML
}
function formatEmailDataAsTable(data) {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.error("Data format error:", e);
      return "Invalid data format";
    }
  }

  if (!Array.isArray(data)) return "No valid data available";

  // 构建表格
  let tableHTML = "<table class='data-table'><thead><tr><th>Email</th><th>Full Name</th></tr></thead><tbody>";

  data.forEach(item => {
    tableHTML += `
      <tr>
        <td>${item.email || '-'}</td>
        <td>${item.full_name || '-'}</td>
      </tr>
    `;
  });

  tableHTML += "</tbody></table>";
  return tableHTML;
}

function formatCensysDataAsTable(data) {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.error("Data format error:", e);
      return "Invalid data format";
    }
  }

  if (!Array.isArray(data)) return "No valid data available";

  // 构建表格
  let tableHTML = "<table class='data-table'><thead><tr><th>Operating_system</th><th>Last_updated_at</th><th>Autonomous_system</th><th>Ip</th><th>Dns</th><th>Location</th><th>Service</th></tr></thead><tbody>";

  data.forEach(item => {
    tableHTML += `
      <tr>
        <td>${item.operating_system || '-'}</td>
        <td>${item.last_updated_at || '-'}</td>
        <td>${item.autonomous_system || '-'}</td>
        <td>${item.ip || '-'}</td>
        <td>${item.dns || '-'}</td>
        <td>${item.location || '-'}</td>
        <td>${item.services || '-'}</td>
      </tr>
    `;
  });

  tableHTML += "</tbody></table>";
  return tableHTML;
}
