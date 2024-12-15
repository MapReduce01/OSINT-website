# OSINT-website
IntelliScout

Our project focuses on using LLM to help our Open Source Intelligence (OSINT) to collect valuable information about organizations in a structured manner from legal and public sources
Traditional OSINT tools  often rely on complex decision-making algorithms, mainly used by cybersecurity experts and data analists. 
However, In recent years, the rapid development of large language models (LLMs), like the GPT series, can change OSINT tools。 With the power of LLMs, these tools can become more user-friendly. LLMs' advanced understanding allow us to turn traditional web crawlers into a security intelligence, enabling every user to access.


First, the IntelliScout use LLM to analyze and filter the infos.
Second, IntelliScout Designed with a user-friendly and intuitive GUI, our tool simplifies complex processes, making it accessible to everyday users.
Third the IntelliScout offers extensive coverage for different kinds of information, besides that,  you can find nearly 1000 orgs without waiting, in our database now.
![image](https://github.com/user-attachments/assets/9f327524-5efe-4cfc-aee0-c5c52d4c3df2)

Installation:

Modify .env.template to match your Mongodb database and openAI API key, and rename it as .env beforehand.

<pip install -r requirements.txt> to install the requireed packages, and put spiderfoot folder from https://github.com/smicallef/spiderfoot in this project root directory. 
![image](https://github.com/user-attachments/assets/c6445bff-4c06-45bc-9290-6f3b7c072e85)
ps:API keys need to be configured first.
spiderfoot APIs being used: censys, github, shodan; please refer to the documentation from https://github.com/smicallef/spiderfoot to configure these APIs.

Leaked email INFO should be put under this project root directory as well, and can be downloaded using: mega:///#!wwcyzJia!nkoPKV4o9WQVeVIQWgz3BSZDXGPXleXJowkcG6e7JTQ
![image](https://github.com/user-attachments/assets/45fb5fac-5b84-4358-a2e6-6d8342873410)



Execution:

<python "execute.py"> to bring up FastAPI       
<\web\index.html> is the frontend index page.
