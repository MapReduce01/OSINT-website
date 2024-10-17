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

# Example usage
if __name__ == "__main__":
    domain = "sfu.ca"
    subdomains = run_subfinder(domain)
    
    # Print subdomains
    if subdomains:
        with open("subfinderoutput.txt", "w") as file:
            print(f"Subdomains for {domain}:")
            for subdomain in subdomains:
                file.write(str(subdomain)+"\n")
    else:
        print(f"No subdomains found for {domain}.")