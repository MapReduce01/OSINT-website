const screenWidth = window.innerWidth;
const targetWidth = 2560;
const scale = screenWidth / targetWidth;
let isTogglefieldListening = true;

const iconContainer1 = document.querySelector('.icon-container');
const hoverbar1 = document.querySelector('.hover-bar');
const bubble1 = document.querySelector('#bubble');
const h11 = document.querySelector('h1');

iconContainer1.addEventListener('mouseover', () => {
  h11.style.filter = 'blur(5px)';
  h11.style.opacity = '0.7';
});
iconContainer1.addEventListener('mouseout', () => {
  h11.style.filter = 'none';
  h11.style.opacity = '1';
});
hoverbar1.addEventListener('mouseover', () => {
  h11.style.filter = 'blur(5px)';
  h11.style.opacity = '0.7';
});
hoverbar1.addEventListener('mouseout', () => {
  h11.style.filter = 'none';
  h11.style.opacity = '1';
});
bubble1.addEventListener('mouseover', () => {
  h11.style.filter = 'blur(5px)';
  h11.style.opacity = '0.7';
});
bubble1.addEventListener('mouseout', () => {
  h11.style.filter = 'none';
  h11.style.opacity = '1';
});

if (scale < 1) {
  document.body.style.zoom = scale;

  // Adjust font size and padding for inputs and buttons
  const elements = document.querySelectorAll('button, input, select, textarea');
  elements.forEach(el => {
    el.style.fontSize = `${parseFloat(window.getComputedStyle(el).fontSize) * scale}px`;
    el.style.padding = `${parseFloat(window.getComputedStyle(el).padding) * scale}px`;
  });
}

// function isPageScrollable() {
//   return document.body.scrollHeight > window.innerHeight;
// }

function handleNonScrollablePage() {
  // isTogglefieldListening = true;
  const resultContainer = document.querySelector('.result-container');
  const infoCard = document.querySelector('.info-card-container');
  resultContainer.style.width = '70%';
  infoCard.style.right = '12%';

}

// function monitorScrollability() {
//   setInterval(() => {
//       if (!isPageScrollable()) {
//           handleNonScrollablePage();
//       }
//   }, 1000); 
// }

// // Start monitoring
// monitorScrollability();


function adjustPageElements() {
  const resultContainer = document.querySelector('.result-container');
  const infoCard = document.querySelector('.info-card-container');
  resultContainer.style.width = '100%';
  infoCard.style.right = '8%';
}


document.addEventListener('DOMContentLoaded', () => {
  const infobox = document.querySelector('.info-card');

  infobox.addEventListener('mousemove', (e) => {
      const rect = infobox.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const maxTilt = 8; // Maximum tilt angle in degrees

      // Directions
      const tiltX = -(y / (rect.height / 2)) * maxTilt; // Vertical tilt
      const tiltY = (x / (rect.width / 2)) * maxTilt; // Horizontal tilt

      // Apply the tilt effect
      infobox.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });

  infobox.addEventListener('mouseleave', () => {
      infobox.style.transform = 'rotateX(0) rotateY(0)'; // Reset tilt
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const hoverBar = document.querySelector('.hover-bar');
  const iconContainer = document.querySelector('.icon-container');
});

document.addEventListener('DOMContentLoaded', () => {
  const bubble = document.getElementById('bubble');
  const aboutLink = document.getElementById('about-link');
  const creditsLink = document.getElementById('credits-link');
  const codeLink = document.getElementById('code-link');
  const contactLink = document.getElementById('contact-link');

  const showBubble = (event, content) => {
      bubble.innerHTML = content; 
      const rect = event.target.getBoundingClientRect();
      // bubble.style.top = `${rect.bottom + window.scrollY + 30}px`;
      // bubble.style.left = `${rect.left + window.scrollX + 80}px`;
      const bubbleTopPercentage = ((rect.bottom + window.scrollY + 30) / window.innerHeight) * 100;
      bubble.style.top = `${bubbleTopPercentage}%`;
      const bubbleLeftPercentage = ((rect.left + window.scrollX + 80) / window.innerWidth) * 100;
      bubble.style.left = `${bubbleLeftPercentage}%`;
      bubble.classList.add('visible');
      bubble.classList.remove('hidden');
  };

  const hideBubble = () => {
      bubble.classList.remove('visible');
      setTimeout(() => {
          bubble.classList.add('hidden');
      }, 300); 
  };

  aboutLink.addEventListener('click', (event) => {
      event.preventDefault();
      showBubble(event, 'About: <br>This website is designed for<br>gathering and analyzing<br>OSINT data of<br>organizations worldwide');
  });

  creditsLink.addEventListener('click', (event) => {
      event.preventDefault();
      showBubble(event, 'Credits: <br>Mazin Ahmed<br>Mohammad Tayebi<br>Yuwen Jia<br>Zhuocheng Xiong<br>Ziyi Zhou<br>Names are listed in alphabetical order.');
  });

  codeLink.addEventListener('click', (event) => {
    event.preventDefault();
    showBubble(event, 'Github: <br>https://github.com/MapReduce01/OSINT-website');
  });

  contactLink.addEventListener('click', (event) => {
    event.preventDefault();
    showBubble(event, 'Contacts: <br>Yuwen Jia: xxx@xxx.com<br>Zhuocheng Xiong: xxx@xxx.com<br>Ziyi Zhou: wjessezhou@gmail.com');
  });

  document.addEventListener('click', (event) => {
      if (!bubble.contains(event.target) && event.target !== aboutLink && event.target !== creditsLink && event.target !== contactLink && event.target !== codeLink) {
          hideBubble();
      }
  });
});

const catBoxes = document.querySelectorAll('.box');
catBoxes.forEach((box, index) => {
    const randomDelay = (Math.random() * 0.8).toFixed(2); 
    box.style.animationDelay = `${randomDelay}s`;
});

document.addEventListener("scroll", () => {
  const h1 = document.querySelector("h1");
  const inputContainer = document.querySelector(".input-container");
  const boxContainer = document.getElementById("boxContainer");

  if (window.scrollY > 50) {
    h1.classList.add("sticky");
    inputContainer.classList.add("sticky");
    boxContainer.classList.add("sticky"); 
  } else {
    h1.classList.remove("sticky");
    inputContainer.classList.remove("sticky");
    // boxContainer.classList.add('fly-left'); 
    boxContainer.classList.remove("sticky"); 
  }
});

document.querySelectorAll('.box').forEach(box => {
  box.onclick = () => {
    togglescroll(box.textContent);
  };
});

function togglescroll(elementOrTitle) {
  let element;
  if (typeof elementOrTitle === "string") {
    element = Array.from(document.querySelectorAll(".field-title")).find(el =>
      el.textContent.trim().includes(elementOrTitle)
    );
    if (!element) {
      console.error(`Element with title "${elementOrTitle}" not found.`);
      return;
    }
  } else {
    element = elementOrTitle;
  }
  element.scrollIntoView({
    behavior: "smooth", 
    block: "center" 
  });
}



function handleSearch() {
    const searchInput = document.getElementById('searchInput').value;
    const infoboxElementId = "infobox";
    
    // Check if the input is not empty
    if (!searchInput.trim()) {
      alert("Please enter a search term.");
      return;
    }

    // function fetchPageTitle(query) {
    //   return fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`)
    //     .then((response) => {
    //       if (!response.ok) {
    //         throw new Error("Network response was not ok " + response.statusText);
    //       }
    //       return response.json();
    //     })
    //     .then((data) => {
    //       if (data.query.search.length > 0) {
    //         return data.query.search[0].title; 
    //       } else {
    //         throw new Error("No results found");
    //       }
    //     });
    // }

    function fetchPageTitle(query) {
      return fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          if (data.query.search.length > 0) {
            // Keywords for prioritization
            const priorityKeywords = ["company", "corporation", "inc.", "incorporated"];
            // Try to find a result containing any of the priority keywords
            const prioritizedResult = data.query.search.find((item) =>
              priorityKeywords.some((keyword) => item.title.toLowerCase().includes(keyword))
            );
            if (prioritizedResult) {
              return prioritizedResult.title;
            }
            // Fallback to the first result if no prioritized result is found
            return data.query.search[0].title;
          } else {
            throw new Error("No results found");
          }
        });
    }
  

    function fetchInfobox(title, infoboxElement) {
      fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&format=json&origin=*`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          const html = data.parse.text["*"];
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
  
          const infoboxHtml = doc.querySelector(".infobox");
  
          if (infoboxHtml) {
            const imageLinks = infoboxHtml.querySelectorAll("a[href*='/wiki/File:']");
            const imagePromises = [];
  
            imageLinks.forEach((link) => {
              const fileName = link.href.split("/wiki/File:")[1];
              if (fileName) {
                const imagePromise = fetchImageUrl(fileName).then((imageUrl) => {
                  const img = document.createElement("img");
                  img.src = imageUrl;
                  img.style.maxWidth = "100%";
                  link.replaceWith(img);
                });
                imagePromises.push(imagePromise);
              }
            });
  
            Promise.all(imagePromises).then(() => {
              infoboxElement.innerHTML = infoboxHtml.outerHTML;
            });
          } else {
            infoboxElement.innerHTML = "<p>Wiki info not found.</p>";
          }
        })
        .catch((error) => {
          console.error("Error fetching Wikipedia infobox:", error);
          infoboxElement.innerHTML = "<p>Failed to load infobox. Please try again later.</p>";
        });
    }
  
    function fetchImageUrl(fileName) {
      return fetch(
        `https://en.wikipedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url&format=json&origin=*`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch image URL: " + response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          const pages = data.query.pages;
          const page = Object.values(pages)[0];
          if (page && page.imageinfo && page.imageinfo[0].url) {
            return page.imageinfo[0].url;
          } else {
            throw new Error("Image URL not found");
          }
        });
    }
  

    function loadInfobox(query, infoboxElementId) {
      const infoboxElement = document.getElementById(infoboxElementId);
      if (!infoboxElement) {
        console.error(`Element with ID '${infoboxElementId}' not found.`);
        return;
      }
  
      infoboxElement.innerHTML = "<p>Loading...</p>";
  
      fetchPageTitle(query)
        .then((title) => fetchInfobox(title, infoboxElement))
        .catch((error) => {
          console.error("Error:", error);
          infoboxElement.innerHTML = `<p>${error.message}</p>`;
        });
    }

    setTimeout(() => {
      loadInfobox(searchInput, infoboxElementId);
      infobox.style.display = "block";
    }, 2000);
    
    // Create the request payload
    // const sInput = { query: searchInput };
  
    let getURL = 'http://0.0.0.0:5000/listOrgInfo?org_name='+searchInput
    
    fetch(getURL, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      displayResults([data]);
    })
    .catch(error => {
        setTimeout(() => {
    		alert("This Org is currently missing in our database, backend processing is now triggered, please check back sometime later.");
	}, 100);
        console.error('There was a problem with the fetch operation:', error);
        
	fetch("http://0.0.0.0:5000/receive-value", {
	    method: "POST",
	    headers: {
		"Content-Type": "application/json"
	    },
	    body: JSON.stringify({ value: searchInput })
	})
	.then(response => response.json())
	.then(data => {
	    // console.log("Response from FastAPI:", data);
	})
	.catch(error => {
	    console.error("Error:", error);
	});
	    });
}

  
function displayResults(results) {
  // console.log(results[0].description)
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = ''; // Clear previous results

  results.forEach(result => {
    const resultContainer = document.createElement('div');
    resultContainer.className = 'result-container';
    resultContainer.innerHTML = `
      <h2 class="org-title">Organization: ${result.org_name || 'Organization'}</h2>
      <div class="fieldbox-container">
        <div class="field-box" onclick="outsideToggle(this)">
          <div class="field-title">
            <span class="arrow">&#9660;</span> Description
          </div>
          <div class="field-content" style="display: none;">${displayFormattedOverview(result.description.Description)}</div>
        </div>
        <div class="field-box" onclick="outsideToggle(this)">
          <div class="field-title">
            <span class="arrow">&#9660;</span> Insight
          </div>
          <div class="field-content" style="display: none;">${displayFormattedOverview(result.insight.Insight)}</div>
        </div>
        <div class="field-box" onclick="outsideToggle(this)">
          <div class="field-title">
            <span class="arrow">&#9660;</span> Account
          </div>
          <div class="field-content" style="display: none;">${formatAccountDataAsTable(result.account)}</div>
        </div>
        <div class="field-box" onclick="outsideToggle(this)">
          <div class="field-title">
            <span class="arrow">&#9660;</span> Censys
          </div>
          <div class="field-content" style="display: none;">${displayDataList(result.censys)}</div>
        </div>
        <div class="field-box" onclick="outsideToggle(this)">
          <div class="field-title">
            <span class="arrow">&#9660;</span> Email
          </div>
          <div class="field-content" style="display: none;">${formatEmailDataAsTable(result.email)}</div>
        </div>
        <div class="field-box" onclick="outsideToggle(this)">
          <div class="field-title">
            <span class="arrow">&#9660;</span> Email Breaches
          </div>
          <div class="field-content" style="display: none;">${formatBreachDataAsTable(result.email_breaches)}</div>
        </div>
        <div class="field-box" onclick="outsideToggle(this)">
          <div class="field-title">
            <span class="arrow">&#9660;</span> GitHub
          </div>
          <div class="field-content" style="display: none;">${formatGithubDataAsTable(result.github)}</div>
        </div>
        <div class="field-box" onclick="outsideToggle(this)">
          <div class="field-title">
            <span class="arrow">&#9660;</span> IP Safe List
          </div>
          <div class="field-content" style="display: none;">${formatIpDataAsTable(result.ip)}</div>
        </div>
      </div>
    `;
    resultsContainer.appendChild(resultContainer);
  });


  const fieldBoxes = document.querySelectorAll('.field-box');
  fieldBoxes.forEach((box, index) => {
      const randomDelay = (Math.random() * 0.8).toFixed(2); 
      box.style.animationDelay = `${randomDelay}s`;
  });
}

// 只控制显示或隐藏字段内容
// function toggleField(element) {
//   const content = element.nextElementSibling;
//   const arrow = element.querySelector(".arrow");
  
//   // 切换显示状态
//   if (content.style.display === "none") {
//     content.style.display = "block";
//     arrow.innerHTML = "&#9650;"; // 上箭头
//   } else {
//     content.style.display = "none";
//     arrow.innerHTML = "&#9660;"; // 下箭头
//   }
// }

// function outsideToggle(element) {
//   const fieldTitle = element.querySelector('.field-title');
//   if (fieldTitle) {
//     toggleField(fieldTitle);   
//   } else {
//     console.error('No .field-title element found.');
//     return null;
//   }
// }

function outsideToggle(element) {
  // Check if the element has already been clicked
  if (element.classList.contains('clicked')) {
    return; // Prevent further actions if already clicked
  }

  const fieldTitle = element.querySelector('.field-title');
  if (fieldTitle) {
    toggleField(fieldTitle);   
  } else {
    console.error('No .field-title element found.');
    return null;
  }
  // Mark the element as clicked
  element.classList.add('clicked');

  // Optionally, disable future clicks visually
  element.style.pointerEvents = 'none'; // Prevent further clicks
  element.style.opacity = '0.5'; // Optional visual feedback
}

function checkSpannedAndAdjustHeight() {
  const spanElements = document.querySelectorAll('.arrow');

  // Check if any span is spanned
  const anySpanned = Array.from(spanElements).some(
    span => span.textContent.trim() === '▲'
  );

  // If any span is spanned, adjust the height of the unspanned ones
  if (anySpanned) {
    spanElements.forEach(span => {
      const fieldTitle = span.parentElement; // Parent: .field-title
      const fieldBox = fieldTitle.parentElement; // Grandparent: .field-box

      if (span.textContent.trim() !== '▲') {
        fieldBox.style.height = '20px'; 
        fieldBox.style.width = '98.5%';
      } else {
        fieldBox.style.height = ''; // Reset height for spanned ones (optional)
      }
    });
  }
}


function toggleField(elementOrTitle) {
  const fieldContainer = document.querySelector('.fieldbox-container');
  
  // Check if already in vertical layout
  if (fieldContainer.classList.contains('vertical-layout')) {
    // Revert to default grid layout
    console.log("pass");
  } else {
    // Apply vertical layout
    fieldContainer.classList.add('vertical-layout');
  }

  // if (isTogglefieldListening) {
  //   isTogglefieldListening = false; 
  //   adjustPageElements(); 
  // } else {
  //   console.log('toggleField() is no longer listening.');
  // }
 
  let element;

  if (typeof elementOrTitle === "string") {
    element = Array.from(document.querySelectorAll(".field-title")).find(el =>
      el.textContent.trim().includes(elementOrTitle)
    );

    if (!element) {
      console.error(`Element with title "${elementOrTitle}" not found.`);
      return;
    }
  } else {
    element = elementOrTitle;
  }

  const content = element.nextElementSibling;
  const arrow = element.querySelector(".arrow");

  if (content.style.display === "none") {
    content.style.display = "block";
    arrow.innerHTML = "&#9650;"; 
  } else {
    content.style.display = "none";
    arrow.innerHTML = "&#9660;"; 
  }

  checkSpannedAndAdjustHeight();

  let spanElements = document.querySelectorAll('.arrow');
  const allNotSpanned = Array.from(spanElements).every(span => span.textContent.trim() !== '▲');


  if (allNotSpanned) {
    fieldContainer.classList.remove('vertical-layout')
    handleNonScrollablePage();
  } 
  else{
    adjustPageElements();
  }

  element.scrollIntoView({
    behavior: "smooth", 
    block: "start" 
  });

  
}

function displayDataList(dataList) {
  return `
      <table class="data-table custom-width-table">
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
                        ${data.operating_system ? `<strong>Product:</strong> ${data.operating_system.product}` : ''}
                        ${data.operating_system ? `<strong>Vendor:</strong> ${data.operating_system.vendor}` : ''}
                        ${data.operating_system ? `<strong>Source:</strong> ${data.operating_system.source}` : ''}
                        ${data.operating_system ? `<strong>Cpe:</strong> ${data.operating_system.cpe}` : ''}
                      </td>
                      </td>
                      <td>
                        <strong>IP Address:</strong> ${data.ip}<br>
                        ${data.dns ? `<strong>DNS:</strong> ${data.dns.reverse_dns.names[0]}` : ''}
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
  let tableHTML = "<table class='data-table'><thead><tr><th>Email</th><th>Possible nick name</th></tr></thead><tbody>";

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

function triggerSearch(event) {
  // Check if the Enter key (key code 13) is pressed
  if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default Enter behavior
      handleSearch(); // Call the search function
  }
}
