import subprocess

def run_subfinder(domain):
    try:
        # Run the Subfinder command with subprocess
        result = subprocess.run(
            ["subfinder", "-d", domain, "-silent"],
            capture_output=True,
            text=True,
            check=True
        )
        
        # Extract subdomains from command output
        subdomains = result.stdout.strip().split("\n")
        return subdomains if subdomains[0] else []
    except subprocess.CalledProcessError as e:
        print(f"An error occurred while running Subfinder: {e}")
        return []
    
def subfinderAPI(domain):   
    subdomains = run_subfinder(domain)
    domain_list = []
    if subdomains:
        for subdomain in subdomains:
            domain_list.append(str(subdomain))
    else:
        print(f"No subdomains found for {domain}.")
    return domain_list
