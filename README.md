# IntelliScout

## Overview

Our project focuses on using LLM to help our Open Source Intelligence (OSINT) to collect valuable information about organizations in a structured manner from legal and public sources
Traditional OSINT tools  often rely on complex decision-making algorithms, mainly used by cybersecurity experts and data analists. 
However, In recent years, the rapid development of large language models (LLMs), like the GPT series, can change OSINT tools。 With the power of LLMs, these tools can become more user-friendly. LLMs' advanced understanding allow us to turn traditional web crawlers into a security intelligence, enabling every user to access.


## Core Features

### Advanced Data Analysis and Filtering

- Leverages LLMs to analyze and filter information effectively, turning raw data into actionable intelligence.
- Context-aware searches: For example, distinguishing between "Apple Inc." and the fruit "Apple."

### Intuitive User Interface

- A user-friendly and intuitive GUI makes the tool accessible to non-experts.
- Simplifies complex OSINT workflows for seamless use.

### Extensive Coverage

- Comprehensive database with nearly 1,000 organizations pre-indexed for instant access.
- Supports a wide range of information types, ensuring thorough data collection.

## Workflow

1. **User Input:** Users enter their query, typically an organization name.
2. **Database Check:** IntelliScout checks its existing database for the requested organization.
3. **Dynamic Search:** If no data is found, the tool activates our search engine to collect data.
4. **Data Display:** Collected data is stored in the database and displayed to the user via the GUI.
![image](https://github.com/user-attachments/assets/7922bc99-9f7d-49af-90eb-4c3ab9f23682)


## Technologies Used

### Data Collection Tools

- **Web Crawler:** Extracts domain names from Wikipedia.
- **Subfinder and Socket API:** Efficiently retrieves sub-domains and IP addresses.
- **AbuseIPDB & Botvrij:** Cross-check IP safety using database check.
- **Censys API:** Provides in-depth technical data, including operating systems, locations, and services.
- **GitHubFinder:** Identifies GitHub accounts to track developer activities.
- **Email Extraction:** Locates organizational email accounts through leaked information.

### Backend and Infrastructure

- **Programming Language:** Python and JavaScript.
- **Database:** MongoDB.
- **Cloud Hosting:** Alibaba Cloud.

![image](https://github.com/user-attachments/assets/9f327524-5efe-4cfc-aee0-c5c52d4c3df2)

## Use Cases

### Security Audits

- Quickly identify network risks by analyzing server types, configurations, TLS settings, open ports, and operating system versions.
- Cross-reference with CVE databases to highlight vulnerabilities, such as outdated software and insecure protocols.

### Social Engineering Simulations

- Gather employee emails and social media data to craft phishing simulations.
- Test employee defenses and identify gaps in security.

### Small Business and Individual Security Monitoring

- Affordable and easy-to-use tool for monitoring security risks.
- Strengthens overall security posture with minimal effort.

## Demo
1. Search for "Simon Fraser University"
![image](https://github.com/user-attachments/assets/3426a5e4-e681-4111-b6fa-f07f664fe43f)
2. Get Info we want
![image](https://github.com/user-attachments/assets/0db6955b-8d15-4f4d-a389-d9861c23f70f)
![image](https://github.com/user-attachments/assets/eb5457c0-2f00-41e7-bd71-210aa7461205)

## Structure
### web
This is the frontend layer, responsible for the user interface and interactions.
### Utilities
This is your API layer, specifically designed to fetch and process data.
### DB_Util
This is the database utility layer, responsible for managing data storage and queries.

## Installation:

Modify .env.template to match your Mongodb database and openAI API key, and rename it as .env beforehand.

<pip install -r requirements.txt> to install the requireed packages, and put spiderfoot folder from https://github.com/smicallef/spiderfoot in this project root directory. 

![image](https://github.com/user-attachments/assets/c6445bff-4c06-45bc-9290-6f3b7c072e85)

ps:API keys need to be configured first.
spiderfoot APIs being used: censys, github, shodan; please refer to the documentation from https://github.com/smicallef/spiderfoot to configure these APIs.

Leaked email INFO should be put under this project root directory as well, and can be downloaded using: mega:///#!wwcyzJia!nkoPKV4o9WQVeVIQWgz3BSZDXGPXleXJowkcG6e7JTQ
![image](https://github.com/user-attachments/assets/45fb5fac-5b84-4358-a2e6-6d8342873410)



**Execution:**

<python "execute.py"> to bring up FastAPI       
<\web\index.html> is the frontend index page.


## Contributor
**MapReduce01**：Jesse Zhou  
**BeardBear02**: Zeph Xiong  
**yuwenjiasfu**: Yuwen Jia
