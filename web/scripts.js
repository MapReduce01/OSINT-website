
// const infoCard = document.querySelector('.info-card');

// infoCard.addEventListener('mousemove', (e) => {
//     const rect = infoCard.getBoundingClientRect();
//     const x = e.clientX - rect.left - rect.width / 2; // Mouse X relative to the element
//     const y = e.clientY - rect.top - rect.height / 2;  // Mouse Y relative to the element


//     const maxTilt = 15; // Maximum tilt angle in degrees
//     const tiltX = (y / (rect.height / 2)) * maxTilt; // Vertical tilt
//     const tiltY = -(x / (rect.width / 2)) * maxTilt; // Horizontal tilt

//     infobox.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
// });

// infobox.addEventListener('mouseleave', () => {
//   infobox.style.transform = 'rotateX(0) rotateY(0)'; // Reset tilt
// });

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
      console.log(`tiltX: ${tiltX}, tiltY: ${tiltY}`);
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

  const showBubble = (event, content) => {
      bubble.innerHTML = content; 
      const rect = event.target.getBoundingClientRect();
      bubble.style.top = `${rect.bottom + window.scrollY + 30}px`;
      bubble.style.left = `${rect.left + window.scrollX + 80}px`;
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
      showBubble(event, 'This website is designed for<br>gathering and analyzing<br>OSINT data of<br>organizations worldwide');
  });

  creditsLink.addEventListener('click', (event) => {
      event.preventDefault();
      showBubble(event, 'Credits: <br>Mazin Ahmed<br>Mohammad Tayebi<br>Yuwen Jia<br>Zhuocheng Xiong<br>Ziyi Zhou<br>Names are listed in alphabetical order.');
  });

  document.addEventListener('click', (event) => {
      if (!bubble.contains(event.target) && event.target !== aboutLink && event.target !== creditsLink) {
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
    box.style.pointerEvents = 'none'; 
    box.style.transform = 'scale(0.8)'; 
    setTimeout(() => {
      box.style.transform = 'scale(1)'; 
      box.style.pointerEvents = ''; 
    }, 50);
    toggleField(box.textContent)
  };
});



function handleSearch() {
    const searchInput = document.getElementById('searchInput').value;
    const infoboxElementId = "infobox";
    
    // Check if the input is not empty
    if (!searchInput.trim()) {
      alert("Please enter a search term.");
      return;
    }

    function fetchPageTitle(query) {
      return fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          if (data.query.search.length > 0) {
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
            infoboxElement.innerHTML = "<p>Infobox not found.</p>";
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
      console.log("2 seconds later...");
      loadInfobox(searchInput, infoboxElementId);
      infobox.style.display = "block";
    }, 2000);
    
    // Create the request payload
    // const sInput = { query: searchInput };
  
    let getURL = 'http://127.0.0.1:5000/listOrgInfo?org_name='+searchInput
    
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
        
	fetch("http://127.0.0.1:5000/receive-value", {
	    method: "POST",
	    headers: {
		"Content-Type": "application/json"
	    },
	    body: JSON.stringify({ value: searchInput })
	})
	.then(response => response.json())
	.then(data => {
	    console.log("Response from FastAPI:", data);
	})
	.catch(error => {
	    console.error("Error:", error);
	});
	    });
}

function handleSearch2() {
  // Simulated data as provided
  const simulatedData = [{
    "_id": {
      "$oid": "673610a56f8c2f295c748e09"
    },
    "uni_id": "SIMONFRASERUNIVERSITY",
    "org_name": "simon fraser university",
    "description": {
      "Description": "Simon Fraser University (SFU) is a public research university located in British Columbia, Canada. Established in 1965, SFU is known for its comprehensive academic programs, emphasis on interdisciplinary research, and commitment to community engagement.\n\n### Key Features:\n\n1. **Campuses**: SFU has three main campuses:\n   - **Burnaby Campus**: The largest campus, located on Burnaby Mountain. It features state-of-the-art facilities and beautiful views of the surrounding landscape.\n   - **Vancouver Campus**: Located in the heart of downtown Vancouver, this campus focuses on business and art programs.\n   - **Surrey Campus**: This campus is dedicated to technology, health, and community engagement.\n\n2. **Academic Programs**: The university offers a wide range of undergraduate and graduate programs across various disciplines, including:\n   - Arts and Social Sciences\n   - Business Administration\n   - Communication\n   - Education\n   - Health Sciences\n   - Engineering Science\n   - Science\n\n3. **Research and Innovation**: SFU is recognized for its research capabilities and innovative approaches in various fields. It has multiple research institutes and centers focusing on areas like health, sustainability, and technology.\n\n4. **Community Engagement**: SFU emphasizes the importance of community service and engagement. The university actively collaborates with local communities, industries, and governments.\n\n5. **Diversity and Inclusion**: SFU prides itself on fostering a diverse and inclusive environment, welcoming students from various backgrounds, cultures, and countries.\n\n6. **Student Life**: The university offers a vibrant student life, with numerous clubs, organizations, and extracurricular activities. Students have access to various resources, including academic support, health services, and recreational facilities.\n\n7. **Global Perspective**: SFU has international partnerships and programs, encouraging students to gain global perspectives through exchanges, internships, and collaborative projects.\n\n8. **Ranking and Recognition**: SFU consistently ranks among the top universities in Canada and is well-regarded in several academic fields globally.\n\nIn summary, Simon Fraser University is a dynamic institution known for its academic excellence, research contributions, community involvement, and commitment to creating a supportive and diverse educational experience for its students."
    },
    "insight": {
      "Insight": "Thank you for providing a detailed overview of Simon Fraser University’s (SFU) academic departments. Here’s a concise recap along with some suggested points you might find useful if you're exploring SFU or considering enrollment:\n\n### Summary of Academic Departments at Simon Fraser University (SFU)\n\n1. **Faculty of Arts and Social Sciences (FASS)**: Diverse departments that explore human behavior, cultures, history, and socio-political dynamics, ideal for students interested in the humanities and social sciences.\n\n2. **Beedie School of Business**: Offers practical and theoretical knowledge across various business disciplines, preparing students for dynamic roles in the corporate world with a strong emphasis on entrepreneurship and analytics.\n\n3. **Faculty of Communication, Art and Technology (FCAT)**: Focuses on the intersection of communication, media, and technology, catering to creative students interested in the arts and digital innovation.\n\n4. **Faculty of Education**: Dedicated to preparing future educators with multidisciplinary methods that address both traditional and modern teaching environments, including a focus on Indigenous and multicultural education.\n\n5. **Faculty of Environment**: Engages with critical environmental issues, equipping students with skills to manage resources sustainably and address ecological challenges.\n\n6. **Faculty of Health Sciences**: Prepares students for emerging careers in health policy, public health, and global health, emphasizing systemic and community health approaches.\n\n7. **Faculty of Science**: Offers foundational and advanced studies in the natural sciences, encouraging analytical thinking and research skills important for various scientific careers.\n\n8. **School of Engineering**: Blends theory with practice, focusing on a comprehensive understanding of engineering principles through specialized programs in mechatronics, software, and environmental engineering.\n\n9. **School for the Contemporary Arts**: Nurtures artistic talents across multiple disciplines, including dance, music, and visual arts, fostering creativity and performance skills.\n\n### Highlighted Departments\n\n- **Department of Criminology**: Known for research-driven programs and a strong link between theory and practice in criminal justice.\n\n- **Department of Psychology**: Offers diverse specializations and an emphasis on applied psychology fields.\n\n- **Department of Education**: Innovative curriculum focused on preparing educators for modern classrooms and diverse student needs.\n\n- **Department of Biological Sciences**: Provides hands-on research experiences that are essential for careers in life sciences.\n\n- **Department of Health Sciences**: Prepares students for impactful careers in public health and healthcare management.\n\n### Conclusion\nSFU emphasizes an interdisciplinary approach to education, integrating research and practical experience to prepare students for various professional paths. For prospective students, visiting the SFU website for updated program details, course offerings, and faculty information is highly recommended for informed decision-making. Whether pursuing a career in the arts, sciences, business, or education, SFU offers a rich array of opportunities tailored to diverse interests and ambitions."
    },
    "account": [
      {
        "website": "Filmot Channel Search",
        "url": "https://filmot.com/channelsearch/simon_fraser_university"
      },
      {
        "website": "Filmot Unlisted Videos",
        "url": "https://filmot.com/unlistedSearch?channelQuery=simon_fraser_university&sortField=uploaddate&sortOrder=desc&"
      },
      {
        "website": "Internet Archive User Search",
        "url": "https://archive.org/search.php?query=simon_fraser_university"
      },
      {
        "website": "Telegram",
        "url": "https://t.me/simon_fraser_university"
      },
      {
        "website": "TikTok",
        "url": "https://www.tiktok.com/@simon_fraser_university?lang=en"
      },
      {
        "website": "YouTube Channel",
        "url": "https://www.youtube.com/c/simon_fraser_university/about"
      },
      {
        "website": "Blogspot",
        "url": "http://simonfraseruniversity.blogspot.com"
      },
      {
        "website": "Chess.com",
        "url": "https://www.chess.com/member/simonfraseruniversity"
      },
      {
        "website": "DockerHub",
        "url": "https://hub.docker.com/v2/users/simonfraseruniversity/"
      },
      {
        "website": "giters",
        "url": "https://giters.com/simonfraseruniversity"
      },
      {
        "website": "Gravatar",
        "url": "https://en.gravatar.com/simonfraseruniversity"
      },
      {
        "website": "Internet Archive User Search",
        "url": "https://archive.org/search.php?query=simonfraseruniversity"
      },
      {
        "website": "issuu",
        "url": "https://issuu.com/simonfraseruniversity"
      },
      {
        "website": "Telegram",
        "url": "https://t.me/simonfraseruniversity"
      },
      {
        "website": "TikTok",
        "url": "https://www.tiktok.com/@simonfraseruniversity?lang=en"
      },
      {
        "website": "tumblr",
        "url": "https://simonfraseruniversity.tumblr.com"
      },
      {
        "website": "Twitch",
        "url": "https://twitch.tv/simonfraseruniversity/"
      },
      {
        "website": "YouTube Channel",
        "url": "https://www.youtube.com/c/simonfraseruniversity/about"
      },
      {
        "website": "YouTube User2",
        "url": "https://www.youtube.com/@simonfraseruniversity"
      }
    ],
    "email": [
      {
        "email": "barbara_hilden@sfu.ca",
        "full_name": "Barbara Hilden"
      },
      {
        "email": "gustavo_balbinot@sfu.ca",
        "full_name": "Gustavo Balbinot"
      },
      {
        "email": "marilyn_e_trautman@sfu.ca",
        "full_name": "Marilyn Trautman"
      },
      {
        "email": "shivani_kundra@sfu.ca",
        "full_name": "Shivani Kundra"
      },
      {
        "email": "damon_van_der_linde@sfu.ca",
        "full_name": "Damon Linde"
      },
      {
        "email": "sarah_mckay@sfu.ca",
        "full_name": "Sarah McKay"
      },
      {
        "email": "kieran_cox@sfu.ca",
        "full_name": "Kieran Cox"
      },
      {
        "email": "amr_marzouk@sfu.ca",
        "full_name": "Amr Marzouk"
      },
      {
        "email": "alexis_carr@sfu.ca",
        "full_name": "Alexis Carr"
      },
      {
        "email": "mkhan@sfu.ca",
        "full_name": "Madiha Khan"
      },
      {
        "email": "jpei@cs.sfu.ca",
        "full_name": "Jian Pei"
      },
      {
        "email": "veronica@cs.sfu.ca",
        "full_name": "Veronica Dahl"
      },
      {
        "email": "stella@cs.sfu.ca",
        "full_name": "Stella Atkins"
      },
      {
        "email": "funda@cs.sfu.ca",
        "full_name": "Funda Ergun"
      },
      {
        "email": "kamal@cs.sfu.ca",
        "full_name": "Kamal Gupta"
      },
      {
        "email": "jcliu@cs.sfu.ca",
        "full_name": "Angie Zhang"
      },
      {
        "email": "ljilja@cs.sfu.ca",
        "full_name": "Angie Zhang"
      },
      {
        "email": "angiez@cs.sfu.ca",
        "full_name": "Angie Zhang"
      },
      {
        "email": "tayebi@cs.sfu.ca",
        "full_name": "Mohammad Tayebi"
      },
      {
        "email": "mehta@cs.sfu.ca",
        "full_name": "Manish Mehta"
      },
      {
        "email": "barbara_hilden@sfu.ca",
        "full_name": "Barbara Hilden"
      },
      {
        "email": "gustavo_balbinot@sfu.ca",
        "full_name": "Gustavo Balbinot"
      },
      {
        "email": "marilyn_e_trautman@sfu.ca",
        "full_name": "Marilyn Trautman"
      },
      {
        "email": "shivani_kundra@sfu.ca",
        "full_name": "Shivani Kundra"
      },
      {
        "email": "damon_van_der_linde@sfu.ca",
        "full_name": "Damon Linde"
      },
      {
        "email": "sarah_mckay@sfu.ca",
        "full_name": "Sarah McKay"
      },
      {
        "email": "kieran_cox@sfu.ca",
        "full_name": "Kieran Cox"
      },
      {
        "email": "amr_marzouk@sfu.ca",
        "full_name": "Amr Marzouk"
      },
      {
        "email": "alexis_carr@sfu.ca",
        "full_name": "Alexis Carr"
      },
      {
        "email": "mkhan@sfu.ca",
        "full_name": "Madiha Khan"
      }
    ],
    "email_breaches": [
      {
        "Email": "amr_marzouk@sfu.ca",
        "Breaches": [
          {
            "Name": "VerificationsIO",
            "BreachDate": "2019-02-25"
          },
          {
            "Name": "DemandScience",
            "BreachDate": "2024-02-28"
          }
        ]
      },
      {
        "Email": "mkhan@sfu.ca",
        "Breaches": [
          {
            "Name": "Dropbox",
            "BreachDate": "2012-07-01"
          },
          {
            "Name": "VerificationsIO",
            "BreachDate": "2019-02-25"
          },
          {
            "Name": "Nitro",
            "BreachDate": "2020-09-28"
          },
          {
            "Name": "Luxottica",
            "BreachDate": "2021-03-16"
          }
        ]
      },
      {
        "Email": "jpei@cs.sfu.ca",
        "Breaches": [
          {
            "Name": "LinkedIn",
            "BreachDate": "2012-05-05"
          },
          {
            "Name": "Dropbox",
            "BreachDate": "2012-07-01"
          },
          {
            "Name": "MDPI",
            "BreachDate": "2016-08-30"
          },
          {
            "Name": "TrikSpamBotnet",
            "BreachDate": "2018-06-12"
          },
          {
            "Name": "Collection1",
            "BreachDate": "2019-01-07"
          },
          {
            "Name": "VerificationsIO",
            "BreachDate": "2019-02-25"
          },
          {
            "Name": "PDL",
            "BreachDate": "2019-10-16"
          },
          {
            "Name": "LinkedInScrape",
            "BreachDate": "2021-04-08"
          },
          {
            "Name": "MGM2022Update",
            "BreachDate": "2019-07-25"
          },
          {
            "Name": "Locally",
            "BreachDate": "2022-10-01"
          },
          {
            "Name": "TelegramCombolists",
            "BreachDate": "2024-05-28"
          },
          {
            "Name": "FairVoteCanada",
            "BreachDate": "2024-03-02"
          }
        ]
      },
      {
        "Email": "veronica@cs.sfu.ca",
        "Breaches": [
          {
            "Name": "Adobe",
            "BreachDate": "2013-10-04"
          },
          {
            "Name": "MoneyBookers",
            "BreachDate": "2009-01-01"
          },
          {
            "Name": "LinkedIn",
            "BreachDate": "2012-05-05"
          },
          {
            "Name": "B2BUSABusinesses",
            "BreachDate": "2017-07-18"
          },
          {
            "Name": "VerificationsIO",
            "BreachDate": "2019-02-25"
          },
          {
            "Name": "Evite",
            "BreachDate": "2013-08-11"
          },
          {
            "Name": "PDL",
            "BreachDate": "2019-10-16"
          },
          {
            "Name": "LinkedInScrape",
            "BreachDate": "2021-04-08"
          },
          {
            "Name": "Gravatar",
            "BreachDate": "2020-10-03"
          },
          {
            "Name": "FairVoteCanada",
            "BreachDate": "2024-03-02"
          }
        ]
      },
      {
        "Email": "stella@cs.sfu.ca",
        "Breaches": [
          {
            "Name": "VerificationsIO",
            "BreachDate": "2019-02-25"
          }
        ]
      },
      {
        "Email": "funda@cs.sfu.ca",
        "Breaches": [
          {
            "Name": "LinkedIn",
            "BreachDate": "2012-05-05"
          },
          {
            "Name": "VerificationsIO",
            "BreachDate": "2019-02-25"
          },
          {
            "Name": "Evite",
            "BreachDate": "2013-08-11"
          },
          {
            "Name": "PDL",
            "BreachDate": "2019-10-16"
          },
          {
            "Name": "LinkedInScrape",
            "BreachDate": "2021-04-08"
          }
        ]
      },
      {
        "Email": "kamal@cs.sfu.ca",
        "Breaches": [
          {
            "Name": "Stratfor",
            "BreachDate": "2011-12-24"
          },
          {
            "Name": "LinkedIn",
            "BreachDate": "2012-05-05"
          },
          {
            "Name": "Dropbox",
            "BreachDate": "2012-07-01"
          },
          {
            "Name": "Adapt",
            "BreachDate": "2018-11-05"
          },
          {
            "Name": "VerificationsIO",
            "BreachDate": "2019-02-25"
          },
          {
            "Name": "PDL",
            "BreachDate": "2019-10-16"
          },
          {
            "Name": "LinkedInScrape",
            "BreachDate": "2021-04-08"
          }
        ]
      },
      {
        "Email": "jcliu@cs.sfu.ca",
        "Breaches": [
          {
            "Name": "LinkedIn",
            "BreachDate": "2012-05-05"
          },
          {
            "Name": "Dropbox",
            "BreachDate": "2012-07-01"
          },
          {
            "Name": "AntiPublic",
            "BreachDate": "2016-12-16"
          },
          {
            "Name": "ExploitIn",
            "BreachDate": "2016-10-13"
          },
          {
            "Name": "MDPI",
            "BreachDate": "2016-08-30"
          },
          {
            "Name": "Collection1",
            "BreachDate": "2019-01-07"
          },
          {
            "Name": "VerificationsIO",
            "BreachDate": "2019-02-25"
          },
          {
            "Name": "PDL",
            "BreachDate": "2019-10-16"
          },
          {
            "Name": "Cit0day",
            "BreachDate": "2020-11-04"
          },
          {
            "Name": "LinkedInScrape",
            "BreachDate": "2021-04-08"
          },
          {
            "Name": "TelegramCombolists",
            "BreachDate": "2024-05-28"
          }
        ]
      },
      {
        "Email": "ljilja@cs.sfu.ca",
        "Breaches": [
          {
            "Name": "LinkedIn",
            "BreachDate": "2012-05-05"
          },
          {
            "Name": "AntiPublic",
            "BreachDate": "2016-12-16"
          },
          {
            "Name": "OnlinerSpambot",
            "BreachDate": "2017-08-28"
          },
          {
            "Name": "Rankwatch",
            "BreachDate": "2016-11-19"
          },
          {
            "Name": "TrikSpamBotnet",
            "BreachDate": "2018-06-12"
          },
          {
            "Name": "Apollo",
            "BreachDate": "2018-07-23"
          },
          {
            "Name": "VerificationsIO",
            "BreachDate": "2019-02-25"
          },
          {
            "Name": "Netlog",
            "BreachDate": "2012-11-01"
          },
          {
            "Name": "PDL",
            "BreachDate": "2019-10-16"
          },
          {
            "Name": "Gravatar",
            "BreachDate": "2020-10-03"
          },
          {
            "Name": "Twitter200M",
            "BreachDate": "2021-01-01"
          },
          {
            "Name": "NazApi",
            "BreachDate": "2023-09-20"
          },
          {
            "Name": "TelegramCombolists",
            "BreachDate": "2024-05-28"
          }
        ]
      },
      {
        "Email": "angiez@cs.sfu.ca",
        "Breaches": [
          {
            "Name": "PDL",
            "BreachDate": "2019-10-16"
          }
        ]
      },
      {
        "Email": "tayebi@cs.sfu.ca",
        "Breaches": [
          {
            "Name": "VerificationsIO",
            "BreachDate": "2019-02-25"
          }
        ]
      },
      {
        "Email": "mehta@cs.sfu.ca",
        "Breaches": [
          {
            "Name": "OnlinerSpambot",
            "BreachDate": "2017-08-28"
          }
        ]
      }
    ],
    "ip": [
      [
        "sfu.ca",
        "cs.sfu.ca",
        "go.sfu.ca",
        "fs.sfu.ca",
        "my.sfu.ca",
        "ad.sfu.ca",
        "mbb.sfu.ca",
        "idp.sfu.ca",
        "cas.sfu.ca",
        "avs.sfu.ca",
        "bms.sfu.ca",
        "cec.sfu.ca",
        "bus.sfu.ca",
        "net.sfu.ca",
        "lib.sfu.ca",
        "cgi.sfu.ca",
        "cep.sfu.ca",
        "pkp.sfu.ca",
        "rcg.sfu.ca",
        "www.sfu.ca",
        "sfu.ca"
      ],
      [
        "142.58.142.32",
        "142.58.142.66",
        "142.58.143.29",
        "208.70.244.23",
        "10.6.132.1",
        "142.58.143.9",
        "142.58.103.55",
        "142.58.143.24",
        "142.58.233.252",
        "142.58.142.134",
        "142.58.142.231"
      ],
      [
        {
          "ip": "10.6.132.1"
        },
        {
          "ip": "142.58.142.134"
        },
        {
          "ip": "208.70.244.23"
        },
        {
          "ip": "142.58.143.29"
        },
        {
          "ip": "142.58.142.32"
        },
        {
          "ip": "142.58.143.24"
        },
        {
          "ip": "142.58.142.231"
        },
        {
          "ip": "142.58.103.55"
        },
        {
          "ip": "142.58.142.66"
        },
        {
          "ip": "142.58.233.252"
        },
        {
          "ip": "142.58.143.9"
        }
      ]
    ],
    "github": [
      {
        "URL": "https://github.com/medooze/sfu",
        "Description": "A future proof, experimental WebRTC VP9 SVC SFU wit end to end encryption support"
      },
      {
        "URL": "https://github.com/inlivedev/sfu",
        "Description": "WebRTC Selective Forwarder Unit(SFU) Golang Library"
      },
      {
        "URL": "https://github.com/webrtc-rs/sfu",
        "Description": "WebRTC Selective Forwarding Unit (SFU) in Rust with Sans-IO"
      },
      {
        "URL": "https://github.com/medooze/sfu",
        "Description": "A future proof, experimental WebRTC VP9 SVC SFU wit end to end encryption support"
      },
      {
        "URL": "https://github.com/inlivedev/sfu",
        "Description": "WebRTC Selective Forwarder Unit(SFU) Golang Library"
      },
      {
        "URL": "https://github.com/webrtc-rs/sfu",
        "Description": "WebRTC Selective Forwarding Unit (SFU) in Rust with Sans-IO"
      },
      {
        "URL": "https://github.com/medooze/sfu",
        "Description": "A future proof, experimental WebRTC VP9 SVC SFU wit end to end encryption support"
      },
      {
        "URL": "https://github.com/inlivedev/sfu",
        "Description": "WebRTC Selective Forwarder Unit(SFU) Golang Library"
      },
      {
        "URL": "https://github.com/webrtc-rs/sfu",
        "Description": "WebRTC Selective Forwarding Unit (SFU) in Rust with Sans-IO"
      }
    ],
    "censys": [
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-14T09:25:04.174Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.74.50",
        "dns": {
          "reverse_dns": {
            "names": [
              "vpr-db34.dc.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "certificate": "cece452211a601a6fde0d3b21c81a4d4a6edb44b8c7a00e64a097f7ea71b1151",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "d10930021431d121d20d232d8d78253e3d9fa9f27a4c36c1aeb72ceda363def7",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "00896952923ea1f91c83fa54d10c351a69e6c88a65318386c26710099d7fe271",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "value": "FortiOS",
              "key": "family"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "last_updated_at": "2024-11-14T04:47:00.335Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.142.13",
        "dns": {
          "reverse_dns": {
            "names": [
              "adv.science.sfu.ca"
            ]
          }
        },
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "e903e62a11d8ff9f975848a286e3fe064bd16407bf5e8cfafd3916cd0e209f2c",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "cd77f8f0604258243249676b41e889d7444455c2e0e87045285f51d448cd7e7f",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "5a40019f05965c59f1ecc70f5ead82caef42217474dc27d80e6f387acf337af7",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "source": "OSI_APPLICATION_LAYER",
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-13T19:06:44.633Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.142.12",
        "dns": {
          "reverse_dns": {
            "names": [
              "mrbs.science.sfu.ca"
            ]
          }
        },
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "e903e62a11d8ff9f975848a286e3fe064bd16407bf5e8cfafd3916cd0e209f2c",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "certificate": "ecdba6d259944df14801421b8683dea64c2e7a7d19e1e2ff4ab9f3a4124538d7",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "02ee83b52f28ba0caa90bf15b76f666537efa4bc64998837feadfeaff0cf54e2",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "city": "Surrey",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V3Z",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.10635,
            "longitude": -122.82509
          }
        },
        "last_updated_at": "2024-11-14T02:42:48.007Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.204.49",
        "dns": {
          "reverse_dns": {
            "names": [
              "bookings9.science.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "e903e62a11d8ff9f975848a286e3fe064bd16407bf5e8cfafd3916cd0e209f2c",
            "port": 443
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "b8b52b2b4cf7eda256767308f0efee2ea7a0e43e0d2cad0daed514d7b17234d0",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "1e52166a81a0106350f7925538110ccaa9f06db546b6ca6c0a272b9c7d67239e",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "last_updated_at": "2024-11-14T12:46:10.349Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.155",
        "dns": {
          "reverse_dns": {
            "names": [
              "at-spal-prd.dc.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "82ee6d31340f9d232b4f6dc99f2caa0dd7cf8971504fca681ba31a303266f273",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "5489122085c56947153ec1d28de57070c3d060d37929727f97ec4eea561e969c",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "19cecb182ede974bcb65f7270922f683b931918033c85a7b1eb57ec00b7b75ea",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-13T23:37:51.050Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.181.59",
        "dns": {
          "reverse_dns": {
            "names": [
              "sc-podium2-2590-01.mps.sfu.ca"
            ]
          }
        },
        "location": {
          "postal_code": "V3Z",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.10635,
            "longitude": -122.82509
          },
          "country_code": "CA",
          "city": "Surrey"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "caaa0cc28d72fb1206a1e6c9bc92bbf7813e2013683b5f21b4439a10ab1bdc97",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "4a38a01c315531370debb114ee0434daab5a1a68a2bb24503d8d2d02e88dddeb",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "3dbb15eed5e4004cc4f8a62ed5d64a757a9320cffa833003654a4cae25675b47",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-13T20:01:00.693Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.40.177",
        "dns": {
          "reverse_dns": {
            "names": [
              "scp-9423-ptr.phys.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "certificate": "bb3add31fa395e989c7083e81478bfb10063c3341927e308aa73de4e1a94b3bb",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "e640a4451f08bff7d1d3641d3a827a881cf94b340eeadf39d914cd899c72100a",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "a9d8f2eb05f2c23bc93891d03bb5a95386b16f510eb8c2d972248fbe815167b8",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-14T07:37:37.354Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.40.189",
        "dns": {
          "reverse_dns": {
            "names": [
              "scp-9412-ptr.phys.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "certificate": "176cc5cd7703cdba2dcd81bc9de7bcbb503ef76b5bd275baf5c927f87037e9bb",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 443
          },
          {
            "certificate": "6749383db296efe10e526e497e88ca74ff8f01afad2ed40e13caf23befa00969",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 8010
          },
          {
            "certificate": "c54ac53a1017b081121de4942b162a67d190175fc9ad0ffc74d879bf60a972b4",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-14T04:58:27.121Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.207.70",
        "dns": {
          "reverse_dns": {
            "names": [
              "mse-laec-backup.ensc.surrey.sfu.ca"
            ]
          }
        },
        "location": {
          "coordinates": {
            "latitude": 49.10635,
            "longitude": -122.82509
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Surrey",
          "country_code": "CA",
          "postal_code": "V3Z"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "a5412289d89a1c2f71d5d45e714b634295ead0dde1cdfc19f31b6c9c676f46d0",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "bdd5a42f5381e56350e4a6eded50ebecd1904cb1e12580f207b0368bd28b6cf5",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "591ac2b4c2320dc6ff3206d277093a6dc8ae844a0035dfd276cc6c5ea0f91824",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-14T05:47:18.492Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.159.93",
        "dns": {
          "reverse_dns": {
            "names": [
              "bby-shellhouse-135.mps.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "3abf797440295d38a05128e77ceff94eb79a5e0315664dd773b51f1f7fdc41a3",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "0e1c4bb3070f9f3700a62976ac61c88ecf0fc3964c5bba25297b763641fdee61",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "06165678cc07bcf1614d4b3f83eba83d37860c07f643653a8d7d85c67a091bcb",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-14T11:39:48.369Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.164",
        "dns": {
          "reverse_dns": {
            "names": [
              "arm-atom-92.dc.sfu.ca"
            ]
          }
        },
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "37da0efe22fc9290dd107d3d04e9c453d4dde45d794967ed480dbfd2975a7426",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "ad53998b1169ad31c0dbe2030edf008c824de5fce129477b67ea9db0cd063636",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "e1f5e599c0a9b1e75a259930a92510e374bf3b75c44d388cadbd9f684d607274",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "last_updated_at": "2024-11-14T13:05:21.370Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.57",
        "dns": {
          "reverse_dns": {
            "names": [
              "arm-dogwood.dc.sfu.ca"
            ]
          }
        },
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 80
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "37da0efe22fc9290dd107d3d04e9c453d4dde45d794967ed480dbfd2975a7426",
            "port": 443
          },
          {
            "certificate": "1cfa56ef059d708d3cdbf34e55c8eae3aef83ab70fe89a45e7679e3ea229533b",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 8010
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "507ca91e587dc0ad768e840efc10f8db5944c08d9b38369726a192b0e11c8223",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-12T01:05:41.779Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "206.12.120.0/21",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "206.12.120.9",
        "dns": {
          "reverse_dns": {
            "names": [
              "206-12-120-9.cloud.computecanada.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "Linux"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "Linux",
          "vendor": "Ubuntu",
          "cpe": "cpe:2.3:o:canonical:ubuntu_linux:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "SSH",
            "service_name": "SSH",
            "port": 22
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "ab2bccb8e27d9414101ac59c8ae0f678684ad12ba6726d70fcd7c784385ef37e",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 5000
          }
        ]
      },
      {
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "last_updated_at": "2024-11-14T06:08:35.372Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.142.48",
        "dns": {
          "reverse_dns": {
            "names": [
              "cas66.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "value": "Firewall",
              "key": "device"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "b3165c03522783aec47f516f3b3cec39b675c7ef436aafc03cc67b9031454431",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "ae246b74acdebcc1bf8ea2ce63148fc6877288eb95d9fac759fb87b59e895a74",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "f4cc908d9a171db140083bfa4da049fd1836e07442b1df5563944a9bf8a33bcc",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-14T12:46:14.313Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.142.66",
        "dns": {
          "reverse_dns": {
            "names": [
              "cas.sfu.ca"
            ]
          }
        },
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "b3165c03522783aec47f516f3b3cec39b675c7ef436aafc03cc67b9031454431",
            "port": 443
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "9531c47919e1e036c2f8665c9669cd0294a55768eb2dfc460e21782fed4f4806",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "dea883182007fc83356258f5ba6c4abb4a6ac2436395124a3ea818ffcb9d4ecd",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-14T06:35:02.789Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.142.56",
        "dns": {
          "reverse_dns": {
            "names": [
              "myschedule.erp.sfu.ca"
            ]
          }
        },
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "c20040ddf9ed8a7ec7417782bfcf30f4f79993576cb407bae6c0437fdd6aabf3",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "6b915097fc9a63751824a7fe795c6de4c58585337515baf29319460a3c6157e8",
            "port": 8010
          },
          {
            "certificate": "5d55b688837aa34a40d9eec44fc17de68cc6149bc8313a251006e3703f565489",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "source": "OSI_APPLICATION_LAYER",
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-14T11:05:17.597Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.204.82",
        "dns": {
          "reverse_dns": {
            "names": [
              "bsb-mktg-grad.bus.sfu.ca"
            ]
          }
        },
        "location": {
          "coordinates": {
            "latitude": 49.10635,
            "longitude": -122.82509
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Surrey",
          "country_code": "CA",
          "postal_code": "V3Z"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "7367b5ae4e7e47b959adb72e0a56d0d71eab45d3be8d24ed6d171916542d7a40",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "76a2c59826312475f74082e4edf4b896e029d8b765d644ceffd9371d59171464",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "5bf2f74a304c1a4846446136a61dfd8cdece6cfbc5cd880dadc5c864f0961dfa",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-14T13:45:00.302Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.171",
        "dns": {
          "reverse_dns": {
            "names": [
              "arm-dogwood-92.dc.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "37da0efe22fc9290dd107d3d04e9c453d4dde45d794967ed480dbfd2975a7426",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "4c91fa77b110f4babfdc3e871be5047e6fc849f249e81c254beea3d1c1af3dc3",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "8a05c104c11067d146d6b77788254bf2e4c95e3b2b1c9f3968774dcbea41aef2",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-14T02:56:59.351Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.173",
        "dns": {
          "reverse_dns": {
            "names": [
              "arm-cottonwood9.dc.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "37da0efe22fc9290dd107d3d04e9c453d4dde45d794967ed480dbfd2975a7426",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "9d3236d2b8829a4bbd19c2de6af30741c37710902a946242728b4925a5a55c1f",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "5eec64d557e23091170c731b61c8cf7592fd42824d482a3289268a02a7245c93",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-14T13:05:13.714Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.142.39",
        "dns": {
          "reverse_dns": {
            "names": [
              "jamfdist.its.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "services": [
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "234c416fd10933b639a9c961a8bfdda54faf8e54328bf913cc3f4949908861d9",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "certificate": "30eeb878b98ab3bc4bf44b641aea84f46f1d571f5ebafb1e123bc1c676505014",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 8010
          },
          {
            "certificate": "1fb13a9f81a5b17b2afc38ea432cde7856bc5ff16697c891c56d4849555cc5e1",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-14T12:58:54.342Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.143.4",
        "operating_system": {
          "other": [
            {
              "value": "FortiOS",
              "key": "family"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "b3165c03522783aec47f516f3b3cec39b675c7ef436aafc03cc67b9031454431",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "eb25c61a6a0ebd0659d831cd6471081a96e92c0c3d6117f6805f38d36c5b4bb7",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "0bb467f6e6fdbcdf85e4fb424bbed7e68ca8da61ed30b65c82529805d705be90",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "last_updated_at": "2024-11-14T06:12:06.806Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.236.7",
        "dns": {
          "reverse_dns": {
            "names": [
              "pamgate01.its.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "services": [
          {
            "service_name": "UNKNOWN",
            "transport_protocol": "TCP",
            "certificate": "13f94b9ede34453b42ce3515b88a28094600e04ae0c66ab751bf6d847e7e1a49",
            "extended_service_name": "UNKNOWN",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "f7f5412fd3fdf5d69b5d9ab60e86d6cd9615e781d1329fbf44415cfbd13811ef",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "aeea712d7c71b575034ee5f571433e2ecf9dbda2ca63b0f290f5a986eee9d106",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "value": "FortiOS",
              "key": "family"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-14T13:42:14.945Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.236.6",
        "dns": {
          "reverse_dns": {
            "names": [
              "pamgate.its.sfu.ca"
            ]
          }
        },
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "services": [
          {
            "extended_service_name": "UNKNOWN",
            "transport_protocol": "TCP",
            "service_name": "UNKNOWN",
            "certificate": "13f94b9ede34453b42ce3515b88a28094600e04ae0c66ab751bf6d847e7e1a49",
            "port": 443
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "f6d2c3512a4a1c5937c23445a7738e95bced442b68619459fe0140ab8c383119",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "bda0cc57f1dc5a32bea42cfad13a230e51f9a9c0cb750fdf55c386d1679d4111",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-14T08:11:28.526Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.58",
        "dns": {
          "reverse_dns": {
            "names": [
              "arm-atom.dc.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "37da0efe22fc9290dd107d3d04e9c453d4dde45d794967ed480dbfd2975a7426",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "d5813e52f0c7466b7a8fdd9a1c008bace3a826e07ae7ab2b0a329c3210f91b8b",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "f1aa132cacc1c96da677f6c6c7c342f56b799a7e5777e4ffbb3e2d29eae6778f",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "last_updated_at": "2024-11-14T10:05:06.265Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.56",
        "dns": {
          "reverse_dns": {
            "names": [
              "arm-cottonwood.dc.sfu.ca"
            ]
          }
        },
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "37da0efe22fc9290dd107d3d04e9c453d4dde45d794967ed480dbfd2975a7426",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "4a4bbfd6d644ecd371e6da586d2f3fd4b952cc5a6c946032f07ef9447ccf129b",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "89a8ed545bea48afa9f6db83318ebf6b5433f8829ad1d848c5c0744d4fa60c71",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-14T01:12:24.335Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.142.205",
        "dns": {
          "reverse_dns": {
            "names": [
              "cmmk-portfolio.its.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "0fa14745be9db5d9f2a53f09ae206c5a252f206879a5c4474614178f9555d265",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "cedddc33565c0dff48fe0c8af73cb09cee77f138ceff9381b7b81a5c1136793b",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "5523f2e25809e70150b635a842cd3a101120122873619c4500a5fd8ef8fc1064",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-14T08:50:29.402Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.72.135",
        "dns": {
          "reverse_dns": {
            "names": [
              "fhs-cam2.fhs.sfu.ca"
            ]
          }
        },
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "bb27dc44fd7fbd13b9faf53fbfa459ec4b39832aec2340d1dd8ebf4b27bcf3b9",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "certificate": "c61e2052fa415b0c3f4f219645a41df789f83cb5923559daf06ae16a5d8fdf99",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "cf889013cec9d73930afe1e8b019b16b7679f31bfb610da2e095c0d7ca6b60ab",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-13T23:40:22.253Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.142.177",
        "dns": {
          "reverse_dns": {
            "names": [
              "rio-1.dc.sfu.ca"
            ]
          }
        },
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "services": [
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "cece452211a601a6fde0d3b21c81a4d4a6edb44b8c7a00e64a097f7ea71b1151",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "4c68f0126ac44d846177c5c43483428a3fc19cb3177ae613e18c15310c10ac07",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "310a5bdf9e94abbbe39e28560402fa3e8233d8ef57692b92782afd836215143a",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "value": "Firewall",
              "key": "device"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "last_updated_at": "2024-11-14T05:56:02.520Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.69",
        "dns": {
          "reverse_dns": {
            "names": [
              "cs-usi-iebms.dc.sfu.ca"
            ]
          }
        },
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "53a74b6ce8bd822205df0cf2d6b04ae984757c94121a5eb9a29db43c715ec0a6",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "dcc51645143803ba32ef263bab1a9c3d6ea3880fee7cf6b53553d51e60092f0e",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "1473609edcc40a4a08af5579212b841ea3be35d0e20e759c7373029eae62c693",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "last_updated_at": "2024-11-13T17:27:04.198Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.140.38",
        "dns": {
          "reverse_dns": {
            "names": [
              "avpltoc.its.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "extended_service_name": "UNKNOWN",
            "transport_protocol": "TCP",
            "service_name": "UNKNOWN",
            "certificate": "234c416fd10933b639a9c961a8bfdda54faf8e54328bf913cc3f4949908861d9",
            "port": 443
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "6b9120586314687bf800d8a11f95ab7d854ae2d31efd9e0b14a754a1527c1520",
            "port": 8010
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "8d5dc8a43a764ddcd9b4e9bc43f63db24ea3ef1c7002022da24f853f9e7723a6",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "last_updated_at": "2024-11-14T10:06:45.572Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.74.96",
        "dns": {
          "reverse_dns": {
            "names": [
              "vpr-db29.dc.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "cece452211a601a6fde0d3b21c81a4d4a6edb44b8c7a00e64a097f7ea71b1151",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "c49529e09f0ddf7bf55089448c1c306872f7f8af1c3cf01b477430e3f7b78731",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "ae29250e29b3893a0c63904789a7bce7b156189469f4aa9fea206aa7fc520dfa",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "last_updated_at": "2024-11-14T09:30:21.364Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.74.35",
        "dns": {
          "reverse_dns": {
            "names": [
              "cs-ms-dev-store.dc.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "4161bf942342f482cf5d43e61301eb1852fbc841b77c5fa0eaec84a72446cd86",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "3e7877fa0e99713571283458c657127123bee9a6b74eac38bfddbe5d6e3caaec",
            "port": 8010
          },
          {
            "certificate": "7594903021ac613980353a11578e672da08a1c145c61ab942c24771ff608dc79",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "last_updated_at": "2024-11-14T05:51:31.413Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.232.171",
        "dns": {
          "reverse_dns": {
            "names": [
              "cs-scweb-02.dc.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "value": "FortiOS",
              "key": "family"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 80
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "c006495fbd4c02ef67291bf89344f67f6fcc198b5406f53819ff7e581f1f0e67",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "f611cd472754a433b9656ff2342a07ab50e96a707743bead7e1ebb29ea7a1f7f",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "e3b0edc8913bbac62134189c577190d5356c422324d883ca9129dd4ec4b24a99",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "last_updated_at": "2024-11-14T13:04:37.608Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.140.100",
        "dns": {
          "reverse_dns": {
            "names": [
              "bsb-mktg-prod4.bus.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "value": "FortiOS",
              "key": "family"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "certificate": "7415c9462405c5e5d2aeb1657191d9fd8a244e55482d07f2a064cf6e51f66b4e",
            "transport_protocol": "TCP",
            "extended_service_name": "UNKNOWN",
            "service_name": "UNKNOWN",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "64238c36cf015dccb23ee02ef48cf7313805b929e8458276354c027d82035da9",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "7b934cbbb27a0a5b1c4cd1259e9dba5d4a070bf3a80d314ff743a07312f3ae00",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "last_updated_at": "2024-11-14T08:20:31.672Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.140.62",
        "dns": {
          "reverse_dns": {
            "names": [
              "sims-stg.erp-dev.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "source": "OSI_APPLICATION_LAYER",
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "extended_service_name": "UNKNOWN",
            "transport_protocol": "TCP",
            "service_name": "UNKNOWN",
            "certificate": "6c508806e9e7baa74f6161d37ecb0d0e7ffe0b82f6d93838d5a20089153e6d45",
            "port": 443
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "c065e6833a9e55255a07277b0428de1b4a0c37d3fe9c02a5d09cc78ea431981e",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "e6f1ff317ebb8f5c9c91f3147de9961206a2c41e3fff2e66856bbfedc9fef332",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "last_updated_at": "2024-11-14T12:31:24.824Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.140.81",
        "dns": {
          "reverse_dns": {
            "names": [
              "treasury-platform.dc.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "extended_service_name": "UNKNOWN",
            "transport_protocol": "TCP",
            "service_name": "UNKNOWN",
            "certificate": "0fd9e02a03bb564af231581bb0f8abd90ec2cc3eb32fbae69dff22abedece80b",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "4de6b27c2270f5c6421a8214a6edb7780f46fc8707dcfdaa6ec696583cf9de63",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "feea8a461da77d11c4b273b1a8fb0e2a7e990ee9fd27c5211e7553217b3c6beb",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "last_updated_at": "2024-11-13T18:39:45.155Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.142.54",
        "dns": {
          "reverse_dns": {
            "names": [
              "bsb-cc-web.bus.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "UNKNOWN",
            "transport_protocol": "TCP",
            "certificate": "7415c9462405c5e5d2aeb1657191d9fd8a244e55482d07f2a064cf6e51f66b4e",
            "extended_service_name": "UNKNOWN",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "1ea14d92b09bb65172b42b1fa64ffff75540050c92c458dab5f13a6e27da05c0",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "a4a8da5d12be6bb201386050f8e95d3856648de9224e544fd673edf79ae993f3",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "last_updated_at": "2024-11-14T12:57:28.064Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.140.40",
        "dns": {
          "reverse_dns": {
            "names": [
              "canvas-snapshot.its.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "source": "OSI_APPLICATION_LAYER",
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "UNKNOWN",
            "transport_protocol": "TCP",
            "certificate": "234c416fd10933b639a9c961a8bfdda54faf8e54328bf913cc3f4949908861d9",
            "extended_service_name": "UNKNOWN",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "27c87bd2a88806f528a757b87a0a8be57b970be079931d5cf384c551f120cd56",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "775f4f3fe6cfdeb9f7c805735283b78fb7e023cd5cab1b4b4161b3bf4d6cfdbd",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-14T12:35:40.235Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.140.15",
        "dns": {
          "reverse_dns": {
            "names": [
              "at-dataserv-dev.its.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "UNKNOWN",
            "transport_protocol": "TCP",
            "certificate": "234c416fd10933b639a9c961a8bfdda54faf8e54328bf913cc3f4949908861d9",
            "extended_service_name": "UNKNOWN",
            "port": 443
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "208c2293a78f45aa8f30bc9f862722d5bd2cd899a36756baf3e77121dfe8d635",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "862384547d04f4325eb88c719b7c989f2cd8974658c9feeb04c13f3e798541d1",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "last_updated_at": "2024-11-14T06:45:13.796Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.232.225",
        "dns": {
          "reverse_dns": {
            "names": [
              "vpr-db9.dc.sfu.ca"
            ]
          }
        },
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "cece452211a601a6fde0d3b21c81a4d4a6edb44b8c7a00e64a097f7ea71b1151",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "34874517dc90b829b04d34f4adc3d77c991cc0b444f914372026c4036266eb6c",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "fd9db799991446d21091bfb5780778d28fae9f0eb8c2988530f8ff490c23271d",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "last_updated_at": "2024-11-14T06:00:58.121Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.6.146",
        "dns": {
          "reverse_dns": {
            "names": [
              "elm.docsol.sfu.ca"
            ]
          }
        },
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "services": [
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "6fd2d880d0509e7361aaebd3b26fc7d6adbe51d4feac978790e8e10adb5523e1",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "7e1c8e4f80dda44d8f4db65b8c52b7890b86e10bc0c8e47a25d2f28ad558ee31",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "860d3bb1d69dc17b870cbfe93afe0419ca15b76b0813e04ca4e058775ce094e3",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "last_updated_at": "2024-11-14T05:51:12.052Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.234.31",
        "operating_system": {
          "other": [
            {
              "value": "FortiOS",
              "key": "family"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "extended_service_name": "UNKNOWN",
            "transport_protocol": "TCP",
            "service_name": "UNKNOWN",
            "certificate": "e78727a00ebd72590e19fdb2d88f258d219afef2830a14436c8bbb781445915b",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "61945da94ea216917c6453eb1594f7566920e627e01b2b30d250732d22f26ff9",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "05199041a5cac1d0a86ef0f32f26b410dc9d79a8ed04337e98f4459391cfaa50",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "last_updated_at": "2024-11-14T06:07:35.688Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.72.143",
        "dns": {
          "reverse_dns": {
            "names": [
              "fhs-cam1.fhs.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "1a2bf73d23c15b98bfee4637d6316113293c56549c71584a5d8580b41c5afc60",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "e7913358907159bac2834c11ad47deda8015bd97a0010e524e16f7e6528ae2d0",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "68e829f193222a9519107174d425ce4ab132ae06e0f9cd846239004ac4daa447",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "source": "OSI_APPLICATION_LAYER",
          "other": [
            {
              "value": "FortiOS",
              "key": "family"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-14T11:50:54.294Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.140.30",
        "dns": {
          "reverse_dns": {
            "names": [
              "www-dev.its.sfu.ca"
            ]
          }
        },
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "certificate": "234c416fd10933b639a9c961a8bfdda54faf8e54328bf913cc3f4949908861d9",
            "transport_protocol": "TCP",
            "extended_service_name": "UNKNOWN",
            "service_name": "UNKNOWN",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "2e2ab3ae12340cc07e73892493336e0308f25462e4f931639654d1068e1a8f0a",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "5e086c8d5c92d5d78f3f1dbdfc7cbb7153145753f7be775c36c7f73a28c253e2",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "last_updated_at": "2024-11-14T06:12:42.566Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.21.43",
        "dns": {
          "reverse_dns": {
            "names": [
              "cs-hci-hp.cmpt.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "value": "Firewall",
              "key": "device"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "6656d8300aa325784d4bb6dc89581f01ef0d4810b357371ceb62ed7bce01782e",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "1209ac7ab577b7b0e051c269fe23f63c1baefbcadf7cd617f65b22157b07d913",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "4cbb80e79d1c117de524ff5b3be6d9858686f7beccf43d0477f3757540b22182",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-14T12:17:25.640Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.74.36",
        "dns": {
          "reverse_dns": {
            "names": [
              "cs-ms-dev-web.dc.sfu.ca"
            ]
          }
        },
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "5730b5d9d0d07352f95b3daee77d6e979791024255c273dcb66bb6a9b8d22e61",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "839f71dd1024248ec07d3d65e795e3f4f87bda6c5b5435ae65a4985af660225c",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "d362d718e0581e12730d690612d34c54555905858884504d28e565b7071d8418",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "last_updated_at": "2024-11-14T13:05:13.361Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.29.134",
        "dns": {
          "reverse_dns": {
            "names": [
              "f600e-border-bcnet.net.sfu.ca"
            ]
          }
        },
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "services": [
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "ad7ac91ca5c9fc1b93bef5e93a05f83391b4cc17fdd263172a6c60a4131fbb78",
            "port": 10443
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "last_updated_at": "2024-11-14T07:13:07.146Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.124",
        "dns": {
          "reverse_dns": {
            "names": [
              "at-web56.dc.sfu.ca"
            ]
          }
        },
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "4b4532fd584173ba40b15d055ddc5c3e7708324e06b2791306af321351ed73eb",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "623bcae3d5f391e192c501d1b27840bef5ed4ba9c7673cfe53673385d9d24b3b",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "d68fac9c5ec1a4ff584a2af1e2b0a0bc29a347a3292e4cd7ee83f2d3a48a13ad",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "last_updated_at": "2024-11-14T13:05:24.320Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.34.130",
        "dns": {
          "reverse_dns": {
            "names": [
              "ensc-8853-clr1.engineering.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "e75dcb8910d9e390d243dceeba01b9abd643ed233acb12279a25afca7116d581",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "63de22856f5cb29014f27f01cd42062ce39f47801255cdd9a85268e5717cef23",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "b5f4c6bc3bd0819a43cb1e9f02710fcfc13ddbc2516f0f20f4cc0db49d646a3b",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "last_updated_at": "2024-11-14T05:58:36.933Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.103.39",
        "dns": {
          "reverse_dns": {
            "names": [
              "rhsat.its.sfu.ca"
            ]
          }
        },
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "bce7843c99f2a3e932d19cb48e9c239f4732cb31c3ff5099a0c531591d5f6ab4",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "1d0ebd58bfd17a9a43d323bdec9941e1d2bc114e1e1af8aea01979c885ef8a01",
            "port": 8010
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "43c23c6dee8eb12a0110e27356f2608006ef6293d3a22f7aeb033363d459084e",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-14T12:27:01.934Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.46",
        "dns": {
          "reverse_dns": {
            "names": [
              "code-my.dc.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "2c7ff6e47103a19e2fded55c9c69303f843d7d18800bf9881d5fd9fdcca1ed7f",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "da9bd7a78e717d9538375b9304c77d4d9eb1d42dbd158af7eeded48049bbbd9b",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "e78eb05763224ee3bfb57874efdc0e4c72bd62a6a340c779419971dfd21e2b55",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-14T09:23:15.675Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.142.51",
        "dns": {
          "reverse_dns": {
            "names": [
              "bsb-tracs.bus.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "certificate": "7415c9462405c5e5d2aeb1657191d9fd8a244e55482d07f2a064cf6e51f66b4e",
            "transport_protocol": "TCP",
            "extended_service_name": "UNKNOWN",
            "service_name": "UNKNOWN",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "d7fe96f337af517320dea0defa9e466201481b780e3b9e9ac6c81ce38c09bfed",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "fdfe45444b889735e605b09e868ecd1b25432d94923994da6114091e2a29b4c9",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "last_updated_at": "2024-11-14T02:46:41.351Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.140.56",
        "dns": {
          "reverse_dns": {
            "names": [
              "snap-test.its.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 80
          },
          {
            "certificate": "234c416fd10933b639a9c961a8bfdda54faf8e54328bf913cc3f4949908861d9",
            "transport_protocol": "TCP",
            "extended_service_name": "UNKNOWN",
            "service_name": "UNKNOWN",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "c4e2c76a102d2d14e63ce3e3e9c726b0d0a19e1ea3c9a53bc3fa6ca60ffdf86f",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "82944eccd17fb9c15119d39443d3307b81193835cd9aaf2c5046a9bd45be5081",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "value": "Firewall",
              "key": "device"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-14T13:04:52.236Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.100",
        "dns": {
          "reverse_dns": {
            "names": [
              "lcp-sp-bi03-prd.dc.sfu.ca"
            ]
          }
        },
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "5cea48f0f01047d3a9783392ecc666afd2e47f08dca91130cc283ee00acf06bc",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "ba5376f1c51caab0e6d8bf00a377460ceda60b3bda667b3e011fe739a63feace",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "4514924a200af1e3f15a04346b1b2e199b701741898a012353118cede4ff7504",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "last_updated_at": "2024-11-13T17:23:56.187Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.34",
        "dns": {
          "reverse_dns": {
            "names": [
              "cs-usi-ebms.dc.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "value": "FortiOS",
              "key": "family"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "8734377da5be6bbfda58529276924772957d32798673ecf98d8d42c1a83e4ad8",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "7ebcc502d25e58f9efbc095344fe21721dd1dabf5d8a1d5bc8fce500704a9b5e",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "884c397c7bf5053826e56e47be80f6a17cdb0ba035dc3085e473123278104cb2",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-14T13:04:39.472Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.140.29",
        "dns": {
          "reverse_dns": {
            "names": [
              "openproject.its.sfu.ca"
            ]
          }
        },
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "UNKNOWN",
            "transport_protocol": "TCP",
            "certificate": "234c416fd10933b639a9c961a8bfdda54faf8e54328bf913cc3f4949908861d9",
            "extended_service_name": "UNKNOWN",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "99dbf6958d514f6abd27d149e08ca039d801066b3c12f30486cdcdf1f8eee5e7",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "24d43869ced7463a4a05ddbdd9097c2ed6dab3da20edb4c9e6f86ff9f8961633",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "last_updated_at": "2024-11-14T08:16:31.154Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.22.52",
        "dns": {
          "reverse_dns": {
            "names": [
              "cs-nll-hp1.cmpt.sfu.ca"
            ]
          }
        },
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "d19d51dbb1e423390dfc03bba15c3703c872daf9a801d6054ea91beda2c37750",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "fa6df9cdaabf2de2836a6e0818a7c99a2d6ca7a82f8981d82095f8444f2aedc2",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "74a4263dd9d4bd63942c3214cda0b04cf54de0e24e286d015ecbe07034a7f9b5",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "source": "OSI_APPLICATION_LAYER",
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-14T11:16:02.245Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.142.125",
        "dns": {
          "reverse_dns": {
            "names": [
              "service-quality.its.sfu.ca"
            ]
          }
        },
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "234c416fd10933b639a9c961a8bfdda54faf8e54328bf913cc3f4949908861d9",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "b01bbce5735ff30d060c10fcd962409cdf6f53363225a5ffe33129b9170f3bff",
            "port": 8010
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "5b7b5cc6549d73adb076dd29a8840de9027f1093b40213e205c99c43df0c418e",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "last_updated_at": "2024-11-14T05:36:59.316Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.129",
        "dns": {
          "reverse_dns": {
            "names": [
              "cs-dm-signage.dc.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "71de7569df257a978cbc982975f07f0a916f462d5d2502e3157da1b4d05d2157",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "7f6da0eb0ae5b3dc13fe66f56dd8f7b86aa1d2603955a4bcd32c05e4b8f7ddbb",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "f441289aabf245434cd1791a1ce4b43a1f856737a1e6d8be1a4b943405c2a760",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-14T02:41:46.110Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.37.72",
        "dns": {
          "reverse_dns": {
            "names": [
              "ensc8.engineering.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "source": "OSI_APPLICATION_LAYER",
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "d7ca62d38b16fc88c8b21856de0815c23a15233e80fa603b312237f4d1e0c415",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "5f82ccadd314a5fb18f950b4f63c7e235b790f1ce13a9ebd86ab6fa00a7b84df",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "218df8556c68c5f0d71edbb44f163ac360c9a2ef86bdbde24f315d05bb50bd89",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "source": "OSI_APPLICATION_LAYER",
          "other": [
            {
              "value": "FortiOS",
              "key": "family"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-14T09:39:12.355Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.232.213",
        "dns": {
          "reverse_dns": {
            "names": [
              "vpr-db2.dc.sfu.ca"
            ]
          }
        },
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "cece452211a601a6fde0d3b21c81a4d4a6edb44b8c7a00e64a097f7ea71b1151",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "certificate": "d08e72520f8bad54b33651db12399d8c294673a5f9e95035434943af6a640dcb",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 8010
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "e63490f5385b385f5eaebc6afbd9928a3b87507241cf279e87a95b26031c0772",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-14T05:55:37.798Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.143.26",
        "dns": {
          "reverse_dns": {
            "names": [
              "webwork.code.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "value": "Firewall",
              "key": "device"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "d5231880cc95eb1f6a2847f2a7b25ae7cbb4e54ffea842a6336bae5d2b9ad914",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "certificate": "b1e69fa1a65478fa25adc750e0359bfdb65b8694d269e485eb585fc153e4a943",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "5bb597363ad9d469c0f384e10273df0e3063d56e8b7180551a39c59253280b3a",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V3Z",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.10635,
            "longitude": -122.82509
          },
          "country_code": "CA",
          "city": "Surrey"
        },
        "last_updated_at": "2024-11-14T11:23:09.660Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.204.18",
        "dns": {
          "reverse_dns": {
            "names": [
              "mail.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "Windows"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "Windows",
          "cpe": "cpe:2.3:o:microsoft:windows:*:*:*:*:*:*:*:*",
          "vendor": "Microsoft"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "certificate": "2fc918882c7da037916092e436246f567354c8e8dc3a6598e734ac7c162c3be1",
            "transport_protocol": "TCP",
            "extended_service_name": "POP3S",
            "service_name": "POP3",
            "port": 110
          },
          {
            "service_name": "IMAP",
            "transport_protocol": "TCP",
            "certificate": "2fc918882c7da037916092e436246f567354c8e8dc3a6598e734ac7c162c3be1",
            "extended_service_name": "IMAPS",
            "port": 143
          },
          {
            "certificate": "2fc918882c7da037916092e436246f567354c8e8dc3a6598e734ac7c162c3be1",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 443
          },
          {
            "certificate": "2fc918882c7da037916092e436246f567354c8e8dc3a6598e734ac7c162c3be1",
            "transport_protocol": "TCP",
            "extended_service_name": "IMAPS",
            "service_name": "IMAP",
            "port": 993
          },
          {
            "extended_service_name": "POP3S",
            "transport_protocol": "TCP",
            "service_name": "POP3",
            "certificate": "2fc918882c7da037916092e436246f567354c8e8dc3a6598e734ac7c162c3be1",
            "port": 995
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "cdc78733999e57c596e3a113c7be4c014803543688db3f370129646f59e0a707",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "6f092661a89a50d2d5e5a71b8c6c18f66caa0a3a0e42fdb8c7c96703e1526d23",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "last_updated_at": "2024-11-14T11:07:00.325Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.170",
        "dns": {
          "reverse_dns": {
            "names": [
              "at-web33.dc.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "value": "FortiOS",
              "key": "family"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "b94151312b4fbd0557533e63ec3d75bf3b29a7a96a236ac15ff8d2036eb6c2a7",
            "port": 443
          },
          {
            "certificate": "7b5e357c6ae0aa52f43d29ab531ee3c34e1261bb15c97ebeeda0479fa797f228",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "3843896fb74f03758a4fc2b49318c12a8406110b0d0d52ba3e65a952e14ec074",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "value": "Firewall",
              "key": "device"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "last_updated_at": "2024-11-14T10:18:27.218Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.53",
        "dns": {
          "reverse_dns": {
            "names": [
              "arm-alder.dc.sfu.ca"
            ]
          }
        },
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "37da0efe22fc9290dd107d3d04e9c453d4dde45d794967ed480dbfd2975a7426",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "c403605fe7e3c854a48ca547ce5fa58af0574784f6eff4a6bfe4edcc273147ee",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "59d4fce74158ba6ce73ea0545aa20d7b5785de0241ec1571047e14bfc329eb50",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "last_updated_at": "2024-11-14T08:19:02.643Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.106.221",
        "dns": {
          "reverse_dns": {
            "names": [
              "cert.gridcanada.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "value": "Firewall",
              "key": "device"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "6496bb5191419d2a12267f6ff36be24010e8f3a0e073411e7ed0ec995b83d7a6",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "d21a0287451824e76a87131b5032770075fdba3b397d3f7530fcee5aae01dc9f",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "a08cab3e0a091e7221b2dfb1433b7957103a7807b591d517c1efdff20e4ef5c1",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "last_updated_at": "2024-11-14T10:33:36.324Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.74.52",
        "dns": {
          "reverse_dns": {
            "names": [
              "at-dweb56.dc.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "source": "OSI_APPLICATION_LAYER",
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "4b4532fd584173ba40b15d055ddc5c3e7708324e06b2791306af321351ed73eb",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "962dd4d76595c518051b407b5c7669630f4849e9d2f94de7ab35e0e6d9fe11f8",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "certificate": "251d71490067acd92aca3050138185fcf411671049ecd1feaef72cd1b5a133c3",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-14T12:29:22.065Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.162",
        "dns": {
          "reverse_dns": {
            "names": [
              "arm-aspen-92.dc.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "source": "OSI_APPLICATION_LAYER",
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "37da0efe22fc9290dd107d3d04e9c453d4dde45d794967ed480dbfd2975a7426",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "37caf6a0c646930f2d6b05ef4b3459cdd4d0cb22940f79bdd8e1956950396c28",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "a0e81f8cc0621306e45dfff848e7ee57782bd46fe976f90ad965ae9953295843",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-14T07:42:05.474Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.140.145",
        "dns": {
          "reverse_dns": {
            "names": [
              "formview-stage.its.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "234c416fd10933b639a9c961a8bfdda54faf8e54328bf913cc3f4949908861d9",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "93700669ebad0164312b303118c767d36cc9a7b471fc78d80507d92a5f4b4a07",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "237842ae823ba824644848459d244a4d12c56e58a24af793144993a30f4b6b1c",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "last_updated_at": "2024-11-14T00:47:09.815Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.161",
        "dns": {
          "reverse_dns": {
            "names": [
              "arm-alder-92.dc.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "value": "FortiOS",
              "key": "family"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "37da0efe22fc9290dd107d3d04e9c453d4dde45d794967ed480dbfd2975a7426",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "885fd9638332bff71a25c9f9cf3353486a391ac99ad930e889d259e1b235f6d4",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "601ce881fc15ac5cd9878a20dc7874ff83621f5aa4f5c8cfe70655f53fb56364",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "last_updated_at": "2024-11-14T13:50:34.297Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.143.56",
        "dns": {
          "reverse_dns": {
            "names": [
              "ss-ciscat-db.its.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "value": "FortiOS",
              "key": "family"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "23d236acf9ced9f6b259f9cb10cfef678f42d738d8eeaf7142493091ba229c12",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "c83815ac070a862bcaa32fc2c624f8e5fd8d6523cda7ca8961f890f9833743a3",
            "port": 8010
          },
          {
            "certificate": "e9b7c1623b955791cc77dd909eb338e883ac014b19a256ca6d437db463fe1a48",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-13T19:07:41.338Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.142.136",
        "dns": {
          "reverse_dns": {
            "names": [
              "api-nsx.its.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "value": "Firewall",
              "key": "device"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "63e6239d9dc75671cfcec95a7f6b1523ceafae03309f08f13a65ef66c6ba0cb2",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "3db32cca453e3442fbd6e758e8e9e1ba5c4865aa35da89e09e5cf97d33455d9f",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "89d2a8270ae153fb733f07048374386a3e0aaa618aafd5e7bd37aa7f94aa527f",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-13T18:01:03.014Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.54",
        "dns": {
          "reverse_dns": {
            "names": [
              "arm-aspen.dc.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "37da0efe22fc9290dd107d3d04e9c453d4dde45d794967ed480dbfd2975a7426",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "7ae9ac4383eaa6270250e64eeb14a53eae2ab14a1cac2f881c6c93ca155f12f7",
            "port": 8010
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "source": "OSI_APPLICATION_LAYER",
          "other": [
            {
              "value": "FortiOS",
              "key": "family"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-13T19:14:00.053Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.111",
        "dns": {
          "reverse_dns": {
            "names": [
              "vpr-db24.dc.sfu.ca"
            ]
          }
        },
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "services": [
          {
            "certificate": "cece452211a601a6fde0d3b21c81a4d4a6edb44b8c7a00e64a097f7ea71b1151",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "58f94c4452b56407ede80929bd7b7336c98e9e0ead3432055f88210693f24de8",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "47e11d7a505d8a27c23b4f5868db8a343f8d745488e15043a21905635c321575",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "last_updated_at": "2024-11-14T11:26:50.425Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.247",
        "dns": {
          "reverse_dns": {
            "names": [
              "ns-mbg1-tw.phones.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "source": "OSI_APPLICATION_LAYER",
          "other": [
            {
              "value": "FortiOS",
              "key": "family"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "f0f802f423b9c8b2eb6046e4876d9bd977e6fd455ca425946aca1dfe06b2a84a",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "extended_service_name": "UNKNOWN",
            "transport_protocol": "TCP",
            "service_name": "UNKNOWN",
            "certificate": "9d3cbca8f13a9a2b61a76675befbbc3d645072de5c0c0c0bfdf08dc1c209c0d9",
            "port": 3998
          },
          {
            "certificate": "9d3cbca8f13a9a2b61a76675befbbc3d645072de5c0c0c0bfdf08dc1c209c0d9",
            "transport_protocol": "TCP",
            "extended_service_name": "UNKNOWN",
            "service_name": "UNKNOWN",
            "port": 5061
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "f0f802f423b9c8b2eb6046e4876d9bd977e6fd455ca425946aca1dfe06b2a84a",
            "extended_service_name": "HTTPS",
            "port": 5063
          },
          {
            "service_name": "UNKNOWN",
            "transport_protocol": "TCP",
            "certificate": "9d3cbca8f13a9a2b61a76675befbbc3d645072de5c0c0c0bfdf08dc1c209c0d9",
            "extended_service_name": "UNKNOWN",
            "port": 6801
          },
          {
            "service_name": "UNKNOWN",
            "transport_protocol": "TCP",
            "certificate": "9d3cbca8f13a9a2b61a76675befbbc3d645072de5c0c0c0bfdf08dc1c209c0d9",
            "extended_service_name": "UNKNOWN",
            "port": 6809
          },
          {
            "service_name": "UNKNOWN",
            "transport_protocol": "TCP",
            "certificate": "9d3cbca8f13a9a2b61a76675befbbc3d645072de5c0c0c0bfdf08dc1c209c0d9",
            "extended_service_name": "UNKNOWN",
            "port": 6881
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "e590212d998adbeb7eb7dd9374ee6c8545e6ea06d43009f06e64ce96493190a5",
            "port": 8010
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "f9a53904848a2da3e599721d9386a4adc032e7af4662bd9761d33eaa992b6363",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          },
          {
            "extended_service_name": "UNKNOWN",
            "transport_protocol": "TCP",
            "service_name": "UNKNOWN",
            "certificate": "f0f802f423b9c8b2eb6046e4876d9bd977e6fd455ca425946aca1dfe06b2a84a",
            "port": 36008
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-14T09:52:28.529Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.142.216",
        "dns": {
          "reverse_dns": {
            "names": [
              "canvas-tools.its.sfu.ca"
            ]
          }
        },
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "234c416fd10933b639a9c961a8bfdda54faf8e54328bf913cc3f4949908861d9",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "5a759c2db80259e50f031475cd20eea82fd53d95d86ba6a8964f3459478c636f",
            "port": 8010
          },
          {
            "certificate": "b7e9de89c7f0b917c5b7167a56e94d4379fe2a2e7b2e5419df43aac640e4b202",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "value": "Firewall",
              "key": "device"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-14T12:40:37.101Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.140.49",
        "dns": {
          "reverse_dns": {
            "names": [
              "at-tweb46.its.sfu.ca"
            ]
          }
        },
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "234c416fd10933b639a9c961a8bfdda54faf8e54328bf913cc3f4949908861d9",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "34d243871f0debb641382ef4e05b6ad489b4da738b48b480bb065813c617741d",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "5e9fcd31fc3d4c0bd096b4d1731ac91f19dda347f8c47b3cbc804396ebd91a26",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "last_updated_at": "2024-11-14T03:07:45.747Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.89",
        "dns": {
          "reverse_dns": {
            "names": [
              "cs-dm-web-01.dc.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 80
          },
          {
            "certificate": "45ff0c4cb3f674df353e3a56283ad3eef29cdafbf7b251e038e4572edc4f6605",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "1db084886c0f4949ca6187e96489bb10e8fa9d311a22da70c2286abb85526590",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "b93ffceff34cf7795a5a81c7e2259188561f224c2be197e8860fb1a959092ef6",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "last_updated_at": "2024-11-14T11:42:15.332Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.246",
        "dns": {
          "reverse_dns": {
            "names": [
              "ns-micollab1.phones.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "f0f802f423b9c8b2eb6046e4876d9bd977e6fd455ca425946aca1dfe06b2a84a",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "UNKNOWN",
            "transport_protocol": "TCP",
            "certificate": "954aab87069f21bced3b30e1956588a4cef680de69e1195660565479930e7217",
            "extended_service_name": "UNKNOWN",
            "port": 3998
          },
          {
            "service_name": "UNKNOWN",
            "transport_protocol": "TCP",
            "certificate": "954aab87069f21bced3b30e1956588a4cef680de69e1195660565479930e7217",
            "extended_service_name": "UNKNOWN",
            "port": 5061
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "f0f802f423b9c8b2eb6046e4876d9bd977e6fd455ca425946aca1dfe06b2a84a",
            "extended_service_name": "HTTPS",
            "port": 5063
          },
          {
            "certificate": "954aab87069f21bced3b30e1956588a4cef680de69e1195660565479930e7217",
            "transport_protocol": "TCP",
            "extended_service_name": "UNKNOWN",
            "service_name": "UNKNOWN",
            "port": 6801
          },
          {
            "certificate": "954aab87069f21bced3b30e1956588a4cef680de69e1195660565479930e7217",
            "transport_protocol": "TCP",
            "extended_service_name": "UNKNOWN",
            "service_name": "UNKNOWN",
            "port": 6809
          },
          {
            "service_name": "UNKNOWN",
            "transport_protocol": "TCP",
            "certificate": "954aab87069f21bced3b30e1956588a4cef680de69e1195660565479930e7217",
            "extended_service_name": "UNKNOWN",
            "port": 6881
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "e35e3a41bf67728ceaac3c207ec6d83f12cff14b2f2ca94a15791cb228386c85",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "94e19357cc7904400c59a08dde2d77a6faa4b4fbb261a581f6b16d530a7473ae",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          },
          {
            "extended_service_name": "UNKNOWN",
            "transport_protocol": "TCP",
            "service_name": "UNKNOWN",
            "certificate": "f0f802f423b9c8b2eb6046e4876d9bd977e6fd455ca425946aca1dfe06b2a84a",
            "port": 36008
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "last_updated_at": "2024-11-14T11:17:11.622Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.251.86",
        "dns": {
          "reverse_dns": {
            "names": [
              "van-sgb1300-col.avs.sfu.ca"
            ]
          }
        },
        "location": {
          "postal_code": "V5Y",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.24966,
            "longitude": -123.11934
          },
          "country_code": "CA",
          "city": "Vancouver"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "8fd920cb8ad5417135dac70b6d078f369c91e5feedccb752310d36e5af5562b9",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "19fe7beb341e02a1dce44c53cb3f02c6be58687b3eec314a4de3096d33ddbf22",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "fdffdbdad8f0eb82486d831d88fb908c923b7de36cdcfa1ef4bc79ee3cd90088",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "last_updated_at": "2024-11-14T09:20:26.154Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.73.81",
        "dns": {
          "reverse_dns": {
            "names": [
              "blu-9402-wp5.avs.sfu.ca"
            ]
          }
        },
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "8fd920cb8ad5417135dac70b6d078f369c91e5feedccb752310d36e5af5562b9",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "certificate": "66167ca9bfe581d8c53d51604c9847c983800219a3470fb0583dd2a0eddf26f0",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "32404b0affd5af93713c9e44661cc3bb998c4a84d3a9cdda900bc559f356777c",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-14T13:04:38.179Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.142.42",
        "dns": {
          "reverse_dns": {
            "names": [
              "oos-prod.its.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "source": "OSI_APPLICATION_LAYER",
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "234c416fd10933b639a9c961a8bfdda54faf8e54328bf913cc3f4949908861d9",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "certificate": "5a0fa20801dec7e16c64be7cfbfac9948fe43f6cb2e5b2e57fb492af8adea20a",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "e0f35cc0dc2cd15bd86329c87e99d1a33d2cc1909bb52a2989ed8030f42fc9a1",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-13T18:04:48.161Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.143.13",
        "dns": {
          "reverse_dns": {
            "names": [
              "at-web64.its.sfu.ca"
            ]
          }
        },
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "234c416fd10933b639a9c961a8bfdda54faf8e54328bf913cc3f4949908861d9",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "d765fd2394e4f46e740eeb4dc736128b09c4d83e6697c1eacd0b4ed7e931443f",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "b798c44e3ab5668f00bb1f88ffe303b5ad51538d683176ce240f5a90fc4b9d3e",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "city": "Burnaby",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V5A",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          }
        },
        "last_updated_at": "2024-11-14T07:47:51.791Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.73.128",
        "dns": {
          "reverse_dns": {
            "names": [
              "blu-9402-wp8.avs.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "8fd920cb8ad5417135dac70b6d078f369c91e5feedccb752310d36e5af5562b9",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "c8545eb61f9737883cfc6c0e7b1bd78a602b1b3ecf0b15b37345644a18d9c394",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-14T13:15:40.485Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.204.51",
        "dns": {
          "reverse_dns": {
            "names": [
              "bsb-tracs3.bus.sfu.ca"
            ]
          }
        },
        "location": {
          "postal_code": "V3Z",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.10635,
            "longitude": -122.82509
          },
          "country_code": "CA",
          "city": "Surrey"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "certificate": "7415c9462405c5e5d2aeb1657191d9fd8a244e55482d07f2a064cf6e51f66b4e",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "170e906400b756f7accc35507ef61cc92a1efaf50e7c25574fb86b29c8289780",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "5f1c98eb95816d25053eb1f97c80999c138b47204144b5bb2ca85866a3340413",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-14T13:54:16.363Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.55",
        "dns": {
          "reverse_dns": {
            "names": [
              "arm-larch.dc.sfu.ca"
            ]
          }
        },
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "37da0efe22fc9290dd107d3d04e9c453d4dde45d794967ed480dbfd2975a7426",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "f1c6653459241664893e35a5bd6d4749fe864d573581e00abcc9a197c17cc6a3",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "certificate": "ae9f85079b24fb698597419c39488958ca5bec1a1c73c56a2ab7c70ddaf32adc",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-13T18:56:44.645Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.233.159",
        "dns": {
          "reverse_dns": {
            "names": [
              "at-esas-prd.dc.sfu.ca"
            ]
          }
        },
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "49c0a99346b213184e517240eeca8bf8486714532efe3b2a7a562f5a68f06b97",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "e145f4148ca38872584a950391f49f8ec2de66510b928be7e83002a18753f6bb",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "f709253111586b9d24a807cf518a08b1275f67e115291fb498fbcf0943cc57b2",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-13T21:36:28.512Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.74.109",
        "dns": {
          "reverse_dns": {
            "names": [
              "at-tweb56.dc.sfu.ca"
            ]
          }
        },
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "certificate": "4b4532fd584173ba40b15d055ddc5c3e7708324e06b2791306af321351ed73eb",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "1a2e462b5a7d8dc546daefa9e39b41616710e8b21daa502432ad9795cb10eb7d",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "782e0456b6cce16de513054bd1603374f5663eff32558eaf3952ceed6adca19e",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "value": "FortiOS",
              "key": "family"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "last_updated_at": "2024-11-14T05:59:16.615Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.142.227",
        "dns": {
          "reverse_dns": {
            "names": [
              "lcp-monitoring.its.sfu.ca"
            ]
          }
        },
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "234c416fd10933b639a9c961a8bfdda54faf8e54328bf913cc3f4949908861d9",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "2302fc2b49842bcbf0bfd2405968b5e2445248338104387b11023647152d8b82",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "c2eaef82b171c562eb80f8fb66d0be15ac16c7af9e5bbf27a586e58dcad53a50",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-14T06:55:11.743Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.74.27",
        "dns": {
          "reverse_dns": {
            "names": [
              "at-sweb56.dc.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "value": "Firewall",
              "key": "device"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "4b4532fd584173ba40b15d055ddc5c3e7708324e06b2791306af321351ed73eb",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "ca64bcbbfb2ff030ea3da811194c44d4112675fd8cfd2f7a06add17cb468044d",
            "port": 8010
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "094f9c5715e407134691446f6807e04cdb378d52a48da10829a051413be03b01",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V3Z",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.10635,
            "longitude": -122.82509
          },
          "country_code": "CA",
          "city": "Surrey"
        },
        "last_updated_at": "2024-11-14T13:04:33.810Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.204.89",
        "dns": {
          "reverse_dns": {
            "names": [
              "neuromix.science.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "e903e62a11d8ff9f975848a286e3fe064bd16407bf5e8cfafd3916cd0e209f2c",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "fee8223c2809f26bcc270f3a68e508b60ce1afc0b26c36152ceab0565497558f",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "50126b95d5dbc4c2dda6782fcf8bccd1e5dba2bbfc6d7a15f2bff26f9e90e7f2",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-14T07:55:02.379Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.72.139",
        "dns": {
          "reverse_dns": {
            "names": [
              "blu-9402-wp7.avs.sfu.ca"
            ]
          }
        },
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "8fd920cb8ad5417135dac70b6d078f369c91e5feedccb752310d36e5af5562b9",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "6a222afa7f6cf71af49fe0858803ee247fb3d54208d320f3e7bfaed549d5e2a2",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "ed69ad129f177a92acd3ffe00d35167f52f4f0a719ca44c02358c1f98dbf849e",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-14T12:59:00.678Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.72.231",
        "dns": {
          "reverse_dns": {
            "names": [
              "blu-9402-wp4.avs.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "value": "Firewall",
              "key": "device"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "8fd920cb8ad5417135dac70b6d078f369c91e5feedccb752310d36e5af5562b9",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "4ecbf8b00c7db2ee4a4aacc2d063800556f300d7b929978840acc4303879e309",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "1192745c3b043bf686ddf2f40b7802cc725b79110d31da35dcc6c0958dcf4d3f",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "city": "Surrey",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "postal_code": "V3Z",
          "country_code": "CA",
          "coordinates": {
            "latitude": 49.10635,
            "longitude": -122.82509
          }
        },
        "last_updated_at": "2024-11-14T13:39:19.081Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.204.35",
        "dns": {
          "reverse_dns": {
            "names": [
              "at-dataserv.its.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "value": "Firewall",
              "key": "device"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "234c416fd10933b639a9c961a8bfdda54faf8e54328bf913cc3f4949908861d9",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "e53758079b550e764916305deb6953cedcefa3db88286192c2f5b097e49eb80b",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "c99e567bcafa92c50664db586866e65042ae30ec47cac141f1926ce326e617f0",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-14T05:59:55.354Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.73.136",
        "dns": {
          "reverse_dns": {
            "names": [
              "blu-9402-wp3.avs.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "8fd920cb8ad5417135dac70b6d078f369c91e5feedccb752310d36e5af5562b9",
            "extended_service_name": "HTTPS",
            "port": 443
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "005466750a534811234bd8511d3aeeb4eb9c0b0a4be22ae780aeadff3666fac5",
            "port": 8010
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "80f1097821926a8ff53b13be50648723eae8452187468003c1a9965d97896c0a",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "coordinates": {
            "latitude": 49.10635,
            "longitude": -122.82509
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Surrey",
          "country_code": "CA",
          "postal_code": "V3Z"
        },
        "last_updated_at": "2024-11-14T09:47:31.813Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.204.26",
        "dns": {
          "reverse_dns": {
            "names": [
              "cas63.its.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "value": "FortiOS",
              "key": "family"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "234c416fd10933b639a9c961a8bfdda54faf8e54328bf913cc3f4949908861d9",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "80e719331935a20ddde5bb515394d2866a510705d7f5347730123923b7815dec",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "6eb975f8ec5178c319c5787f7b6f83e65ef910fc8dd20816e1b28e50717f7c71",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "value": "Firewall",
              "key": "device"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*",
          "vendor": "Fortinet"
        },
        "last_updated_at": "2024-11-14T04:50:19.300Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.142.64",
        "dns": {
          "reverse_dns": {
            "names": [
              "scholarships.its.sfu.ca"
            ]
          }
        },
        "location": {
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "city": "Burnaby",
          "country_code": "CA",
          "postal_code": "V5A"
        },
        "services": [
          {
            "certificate": "234c416fd10933b639a9c961a8bfdda54faf8e54328bf913cc3f4949908861d9",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "f384f264d9000916a41c85a6f44ae3af92f05d5c0704f1abd48641334929ee10",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "f12dde36b4c19e076576e0cb7718230a79abb357b462f45276f1cca7f0c3002f",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-13T17:50:01.183Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.140.163",
        "dns": {
          "reverse_dns": {
            "names": [
              "at-sweb48.its.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "other": [
            {
              "value": "FortiOS",
              "key": "family"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 80
          },
          {
            "certificate": "234c416fd10933b639a9c961a8bfdda54faf8e54328bf913cc3f4949908861d9",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "1ad439621f8e95c46998bd2ca3f38c689aee67e3156e852f3bb84e2d818f8a91",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "6d1c0ee9a5f79f9ac04dbbdfe738d75a4b85b44990e0267c509ac48a3616f22b",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "last_updated_at": "2024-11-14T09:47:52.832Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.140.217",
        "dns": {
          "reverse_dns": {
            "names": [
              "at-dataserv-tst.its.sfu.ca"
            ]
          }
        },
        "operating_system": {
          "source": "OSI_APPLICATION_LAYER",
          "other": [
            {
              "value": "FortiOS",
              "key": "family"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "services": [
          {
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "extended_service_name": "HTTP",
            "port": 80
          },
          {
            "extended_service_name": "HTTPS",
            "transport_protocol": "TCP",
            "service_name": "HTTP",
            "certificate": "234c416fd10933b639a9c961a8bfdda54faf8e54328bf913cc3f4949908861d9",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "9d2e70647bda0a9f304525bd31bf84d8406b026be8f56b0ea0a63ecf46e7ea86",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "ccc335037b24deeb9c8eb0ba7f0c4ef875e77f721ee1dc3e71a637424d9a7a88",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      },
      {
        "operating_system": {
          "other": [
            {
              "key": "family",
              "value": "FortiOS"
            },
            {
              "key": "device",
              "value": "Firewall"
            }
          ],
          "source": "OSI_APPLICATION_LAYER",
          "part": "o",
          "product": "FortiOS",
          "vendor": "Fortinet",
          "cpe": "cpe:2.3:o:fortinet:fortios:*:*:*:*:*:*:*:*"
        },
        "last_updated_at": "2024-11-14T05:47:15.938Z",
        "autonomous_system": {
          "description": "SFU-AS",
          "bgp_prefix": "142.58.0.0/16",
          "asn": 11105,
          "country_code": "CA",
          "name": "SFU-AS"
        },
        "ip": "142.58.236.5",
        "dns": {
          "reverse_dns": {
            "names": [
              "gateway2.its.sfu.ca"
            ]
          }
        },
        "location": {
          "postal_code": "V5A",
          "province": "British Columbia",
          "timezone": "America/Vancouver",
          "country": "Canada",
          "continent": "North America",
          "coordinates": {
            "latitude": 49.26636,
            "longitude": -122.95263
          },
          "country_code": "CA",
          "city": "Burnaby"
        },
        "services": [
          {
            "certificate": "13f94b9ede34453b42ce3515b88a28094600e04ae0c66ab751bf6d847e7e1a49",
            "transport_protocol": "TCP",
            "extended_service_name": "HTTPS",
            "service_name": "HTTP",
            "port": 443
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "94837fee69186c2c66c6486e8a7205a6205a4a051984cb4dd8f303b61de9a7b5",
            "extended_service_name": "HTTPS",
            "port": 8010
          },
          {
            "service_name": "HTTP",
            "transport_protocol": "TCP",
            "certificate": "66cfc01967c96104a5a65b5806dfc9fa5cf69bc6e42cafa7896fc0b4f46b31b6",
            "extended_service_name": "HTTPS",
            "port": 8015
          },
          {
            "transport_protocol": "TCP",
            "extended_service_name": "HTTP",
            "service_name": "HTTP",
            "port": 8020
          }
        ]
      }
    ]
  }];

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
          <span class="arrow">&#9660;</span> Description
        </div>
        <div class="field-content" style="display: none;">${displayFormattedOverview(result.description.Description)}</div>
      </div>
      <div class="field-box">
        <div class="field-title" onclick="toggleField(this)">
          <span class="arrow">&#9660;</span> Insight
        </div>
        <div class="field-content" style="display: none;">${displayFormattedOverview(result.insight.Insight)}</div>
      </div>
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
          <span class="arrow">&#9660;</span> IP Safe List
        </div>
        <div class="field-content" style="display: none;">${formatIpDataAsTable(result.ip)}</div>
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

function toggleField(elementOrTitle) {
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

function triggerSearch(event) {
  // Check if the Enter key (key code 13) is pressed
  if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default Enter behavior
      handleSearch(); // Call the search function
  }
}
